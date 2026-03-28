import { useEffect, useState } from 'react'
import { FiClock, FiMapPin, FiSettings, FiSmartphone } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { settingsService } from '@/services/settingsService'

const initialForm = {
  centerName: '',
  institutionalEmail: '',
  institutionalPhone: '',
  whatsappUrl: '',
  address: '',
  businessHoursSummary: '',
  defaultServiceDurationMinutes: 60,
  defaultSessionDurationMinutes: 45,
  slotIntervalMinutes: 30,
}

const buildForm = (settings) => ({
  centerName: settings.centerName ?? '',
  institutionalEmail: settings.institutionalEmail ?? '',
  institutionalPhone: settings.institutionalPhone ?? '',
  whatsappUrl: settings.whatsappUrl ?? '',
  address: settings.address ?? '',
  businessHoursSummary: settings.businessHoursSummary ?? '',
  defaultServiceDurationMinutes: settings.defaultServiceDurationMinutes ?? 60,
  defaultSessionDurationMinutes: settings.defaultSessionDurationMinutes ?? 45,
  slotIntervalMinutes: settings.slotIntervalMinutes ?? 30,
})

export const SettingsPage = () => {
  const [form, setForm] = useState(initialForm)
  const [loadedForm, setLoadedForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [saveNotice, setSaveNotice] = useState('')
  const [lastUpdatedAt, setLastUpdatedAt] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await settingsService.getManage()
        const nextForm = buildForm(settings)
        setForm(nextForm)
        setLoadedForm(nextForm)
        setLastUpdatedAt(settings.updatedAt ?? '')
        setError('')
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: ['defaultServiceDurationMinutes', 'defaultSessionDurationMinutes', 'slotIntervalMinutes'].includes(field)
        ? Number(event.target.value)
        : event.target.value,
    }))
    setSaveNotice('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSaving(true)
      const updatedSettings = await settingsService.updateManage(form)
      const nextForm = buildForm(updatedSettings)
      setForm(nextForm)
      setLoadedForm(nextForm)
      setLastUpdatedAt(updatedSettings.updatedAt ?? '')
      setError('')
      setSaveNotice('La configuración general quedó actualizada.')
    } catch (submitError) {
      setError(submitError.message)
      setSaveNotice('')
    } finally {
      setIsSaving(false)
    }
  }

  const formattedUpdatedAt = lastUpdatedAt
    ? new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(lastUpdatedAt))
    : ''

  return (
    <div className="grid gap-6">
      <PanelCard>
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
            <FiSettings aria-hidden="true" className="size-5" />
          </div>
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[rgba(47,93,115,0.58)]">Configuración general</p>
            <h2 className="mt-3 text-3xl font-semibold text-[var(--color-primary)]">Parámetros base del centro</h2>
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.72)]">
              Desde acá administrás datos institucionales, canales de contacto y valores operativos por defecto. Estos
              datos se reflejan en la página pública de contacto y orientan la operación diaria del panel.
            </p>
            {formattedUpdatedAt ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(47,93,115,0.58)]">
                Última actualización: {formattedUpdatedAt}
              </p>
            ) : null}
          </div>
        </div>
      </PanelCard>

      {isLoading ? (
        <PanelCard>
          <p className="text-sm text-[rgba(46,46,46,0.68)]">Cargando configuración actual...</p>
        </PanelCard>
      ) : (
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <PanelCard>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
                  <FiMapPin aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[var(--color-primary)]">Identidad institucional</h3>
                  <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
                    Datos base que describen al centro y ordenan su presencia institucional.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <Field label="Nombre del centro">
                  <input className="field-input" onChange={updateField('centerName')} required value={form.centerName} />
                </Field>
                <Field label="Dirección o referencia principal">
                  <input className="field-input" onChange={updateField('address')} required value={form.address} />
                </Field>
                <Field hint="Texto breve que se muestra como referencia operativa." label="Horario de atención">
                  <input
                    className="field-input"
                    onChange={updateField('businessHoursSummary')}
                    required
                    value={form.businessHoursSummary}
                  />
                </Field>
              </div>
            </PanelCard>

            <PanelCard>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
                  <FiSmartphone aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[var(--color-primary)]">Contacto operativo</h3>
                  <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
                    Canales visibles para consultas institucionales y primer contacto con familias.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <Field label="Email institucional">
                  <input
                    className="field-input"
                    onChange={updateField('institutionalEmail')}
                    required
                    type="email"
                    value={form.institutionalEmail}
                  />
                </Field>
                <Field label="Teléfono principal">
                  <input
                    className="field-input"
                    onChange={updateField('institutionalPhone')}
                    required
                    value={form.institutionalPhone}
                  />
                </Field>
                <Field hint="Usá un enlace completo tipo https://wa.me/..." label="URL de WhatsApp">
                  <input className="field-input" onChange={updateField('whatsappUrl')} required value={form.whatsappUrl} />
                </Field>
              </div>
            </PanelCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <PanelCard>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[rgba(47,93,115,0.08)] p-3 text-[var(--color-primary)]">
                  <FiClock aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[var(--color-primary)]">Valores operativos</h3>
                  <p className="mt-1 text-sm text-[rgba(46,46,46,0.68)]">
                    Defaults para sostener una operación más consistente y previsible.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Field hint="Se usa como sugerencia inicial al crear servicios." label="Duración por defecto de servicios">
                  <input
                    className="field-input"
                    min="15"
                    onChange={updateField('defaultServiceDurationMinutes')}
                    required
                    type="number"
                    value={form.defaultServiceDurationMinutes}
                  />
                </Field>
                <Field hint="Preparado para próximas mejoras de agenda." label="Duración por defecto de sesiones">
                  <input
                    className="field-input"
                    min="15"
                    onChange={updateField('defaultSessionDurationMinutes')}
                    required
                    type="number"
                    value={form.defaultSessionDurationMinutes}
                  />
                </Field>
                <Field hint="Paso sugerido entre bloques de agenda." label="Intervalo base">
                  <input
                    className="field-input"
                    min="15"
                    onChange={updateField('slotIntervalMinutes')}
                    required
                    type="number"
                    value={form.slotIntervalMinutes}
                  />
                </Field>
              </div>
            </PanelCard>

            <PanelCard className="bg-[rgba(47,93,115,0.05)]">
              <h3 className="text-2xl font-semibold text-[var(--color-primary)]">Qué impacta hoy</h3>
              <div className="mt-5 grid gap-3 text-sm leading-7 text-[rgba(46,46,46,0.74)]">
                <p>La página pública de contacto toma el email, teléfono, dirección, horario y WhatsApp definidos acá.</p>
                <p>El módulo de servicios usa la duración por defecto configurada como sugerencia inicial para nuevas altas.</p>
                <p>Los demás valores de agenda quedan listos para ampliar el panel sin volver a dispersar parámetros.</p>
              </div>
            </PanelCard>
          </div>

          {error ? (
            <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{error}</div>
          ) : null}

          {saveNotice ? (
            <div className="rounded-2xl border border-[rgba(47,93,115,0.14)] bg-[rgba(167,196,181,0.18)] px-4 py-3 text-sm text-[var(--color-primary)]">
              {saveNotice}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              onClick={() => {
                setForm(loadedForm)
                setError('')
                setSaveNotice('')
              }}
              type="button"
              variant="ghost"
            >
              Restablecer cambios
            </Button>
            <Button disabled={isSaving} type="submit">
              {isSaving ? 'Guardando configuración...' : 'Guardar configuración'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
