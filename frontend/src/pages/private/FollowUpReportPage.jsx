import { useEffect } from 'react'
import { FiArrowLeft, FiPrinter } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { followUpsService } from '@/services/followUpsService'
import { formatDate } from '@/utils/formatters'
import { sanitizeRichText } from '@/utils/richText'

const buildReportMetadata = (followUp) => [
  {
    label: 'Profesional',
    value: followUp.professional?.user?.fullName ?? 'Sin profesional asignado',
  },
  {
    label: 'Alumno',
    value: `${followUp.child?.firstName ?? ''} ${followUp.child?.lastName ?? ''}`.trim() || 'Sin alumno asociado',
  },
  {
    label: 'Fecha',
    value: formatDate(followUp.followUpDate ?? followUp.session?.startsAt ?? followUp.createdAt),
  },
  {
    label: 'Autor del registro',
    value: followUp.authorUser?.fullName ?? 'Sin autor registrado',
  },
]

export const FollowUpReportPage = () => {
  const { id } = useParams()
  const {
    data: followUp,
    error,
    isLoading,
  } = useAsyncData(() => followUpsService.getById(id), [id])

  useEffect(() => {
    if (!followUp || Array.isArray(followUp)) {
      return undefined
    }

    const previousTitle = document.title
    const reportTitle = followUp.title?.trim() || 'Informe de seguimiento'

    document.title = `${reportTitle} | Puentes`

    return () => {
      document.title = previousTitle
    }
  }, [followUp])

  if (isLoading) {
    return <LoadingScreen message="Preparando informe..." />
  }

  if (error || !followUp || Array.isArray(followUp)) {
    return (
      <PanelCard>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[rgba(47,93,115,0.58)]">Seguimientos</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">No pudimos abrir el informe</h2>
          </div>
          <p className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
            {error?.message ?? 'El informe solicitado no está disponible.'}
          </p>
          <div>
            <Button as={Link} to="/app/seguimientos" variant="outline">
              <FiArrowLeft aria-hidden="true" className="mr-2 size-4" />
              Volver a seguimientos
            </Button>
          </div>
        </div>
      </PanelCard>
    )
  }

  const reportTitle = followUp.title?.trim() || 'Informe de seguimiento'
  const reportSummary = followUp.summary?.trim()
  const reportMetadata = buildReportMetadata(followUp)

  return (
    <div className="follow-up-print-page space-y-5">
      <div className="follow-up-print-actions flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[rgba(47,93,115,0.58)]">Seguimientos</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">Vista imprimible del informe</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button as={Link} to="/app/seguimientos" variant="outline">
            <FiArrowLeft aria-hidden="true" className="mr-2 size-4" />
            Volver
          </Button>
          <Button onClick={() => window.print()} type="button" variant="outline">
            <FiPrinter aria-hidden="true" className="mr-2 size-4" />
            Imprimir informe
          </Button>
        </div>
      </div>

      <PanelCard className="follow-up-report-card p-0">
        <div className="follow-up-report-sheet mx-auto max-w-4xl px-6 py-8 sm:px-10">
          <header className="flex flex-col gap-5 border-b border-[rgba(47,93,115,0.12)] pb-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[rgba(47,93,115,0.56)]">
                Informe de seguimiento
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[var(--color-primary)]">
                {reportTitle}
              </h1>
              {reportSummary ? (
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[rgba(46,46,46,0.72)]">{reportSummary}</p>
              ) : null}
            </div>

            <div className="text-sm leading-7 text-[rgba(46,46,46,0.62)] md:text-right">
              <p className="font-semibold text-[var(--color-primary)]">Puentes</p>
              <p>Centro interdisciplinario de acompañamiento</p>
            </div>
          </header>

          <section className="mt-8">
            <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
              {reportMetadata.map((item, index) => (
                <article
                  key={item.label}
                  className={index < reportMetadata.length - 2 ? 'pb-1' : ''}
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[rgba(47,93,115,0.52)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-base font-medium text-[rgba(46,46,46,0.9)]">{item.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="border-b border-[rgba(47,93,115,0.12)] pb-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[rgba(47,93,115,0.56)]">
                Nota de seguimiento
              </p>
            </div>

            <div
              className="follow-up-report-body mt-5 text-[15px] leading-7 text-[rgba(46,46,46,0.92)]"
              dangerouslySetInnerHTML={{ __html: sanitizeRichText(followUp.note) }}
            />
          </section>

          <footer className="mt-10 border-t border-[rgba(47,93,115,0.12)] pt-4 text-xs uppercase tracking-[0.18em] text-[rgba(46,46,46,0.48)]">
            Documento generado desde el panel interno de Puentes
          </footer>
        </div>
      </PanelCard>
    </div>
  )
}
