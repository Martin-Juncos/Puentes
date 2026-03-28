import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'
import { Field } from '@/components/ui/Field'
import { PanelCard } from '@/components/ui/PanelCard'
import { useAsyncData } from '@/hooks/useAsyncData'
import { attendancesService } from '@/services/attendancesService'
import { childrenService } from '@/services/childrenService'
import { familiesService } from '@/services/familiesService'
import { paymentsService } from '@/services/paymentsService'
import { sessionsService } from '@/services/sessionsService'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'

const initialPayment = {
  childId: '',
  familyId: '',
  sessionId: '',
  amount: 0,
  dueDate: '',
  notes: '',
}

const initialAttendance = {
  sessionId: '',
  status: 'PRESENT',
  notes: '',
}

export const PaymentsPage = () => {
  const [paymentForm, setPaymentForm] = useState(initialPayment)
  const [attendanceForm, setAttendanceForm] = useState(initialAttendance)
  const [paymentError, setPaymentError] = useState('')
  const [attendanceError, setAttendanceError] = useState('')

  const { data: payments, reload: reloadPayments } = useAsyncData(() => paymentsService.list(), [])
  const { data: attendances, reload: reloadAttendances } = useAsyncData(() => attendancesService.list(), [])
  const { data: children } = useAsyncData(() => childrenService.list(), [])
  const { data: families } = useAsyncData(() => familiesService.list(), [])
  const { data: sessions } = useAsyncData(() => sessionsService.list(), [])

  const updatePaymentField = (field) => (event) =>
    setPaymentForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const updateAttendanceField = (field) => (event) =>
    setAttendanceForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handlePaymentSubmit = async (event) => {
    event.preventDefault()

    try {
      await paymentsService.create({
        ...paymentForm,
        amount: Number(paymentForm.amount),
        sessionId: paymentForm.sessionId || undefined,
      })
      setPaymentForm(initialPayment)
      setPaymentError('')
      reloadPayments()
    } catch (error) {
      setPaymentError(error.message)
    }
  }

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault()

    try {
      await attendancesService.upsert(attendanceForm)
      setAttendanceForm(initialAttendance)
      setAttendanceError('')
      reloadAttendances()
    } catch (error) {
      setAttendanceError(error.message)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Registrar cobro</h2>
          <form className="mt-6 grid gap-4" onSubmit={handlePaymentSubmit}>
            <Field label="Niño o niña">
              <select className="field-input" onChange={updatePaymentField('childId')} required value={paymentForm.childId}>
                <option value="">Seleccionar</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Familia">
              <select className="field-input" onChange={updatePaymentField('familyId')} required value={paymentForm.familyId}>
                <option value="">Seleccionar</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.displayName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sesión asociada">
              <select className="field-input" onChange={updatePaymentField('sessionId')} value={paymentForm.sessionId}>
                <option value="">Opcional</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.child.firstName} {session.child.lastName} · {formatDateTime(session.startsAt)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Monto">
              <input className="field-input" min="0" onChange={updatePaymentField('amount')} required type="number" value={paymentForm.amount} />
            </Field>
            <Field label="Vencimiento">
              <input className="field-input" onChange={updatePaymentField('dueDate')} type="date" value={paymentForm.dueDate} />
            </Field>
            <Field label="Notas">
              <textarea className="field-input min-h-24" onChange={updatePaymentField('notes')} value={paymentForm.notes} />
            </Field>
            {paymentError ? <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{paymentError}</div> : null}
            <Button type="submit">Guardar cobro</Button>
          </form>
        </PanelCard>

        <PanelCard>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Registrar asistencia</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleAttendanceSubmit}>
            <Field label="Sesión">
              <select className="field-input" onChange={updateAttendanceField('sessionId')} required value={attendanceForm.sessionId}>
                <option value="">Seleccionar</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.child.firstName} {session.child.lastName} · {formatDateTime(session.startsAt)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estado">
              <select className="field-input" onChange={updateAttendanceField('status')} value={attendanceForm.status}>
                <option value="PRESENT">Presente</option>
                <option value="ABSENT">Ausente</option>
                <option value="RESCHEDULED">Reprogramado</option>
                <option value="CANCELED">Cancelado</option>
              </select>
            </Field>
            <Field label="Notas">
              <textarea className="field-input min-h-24" onChange={updateAttendanceField('notes')} value={attendanceForm.notes} />
            </Field>
            {attendanceError ? <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">{attendanceError}</div> : null}
            <Button type="submit" variant="secondary">
              Guardar asistencia
            </Button>
          </form>
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Cobros</h2>
          <div className="mt-6">
            <DataTable
              columns={[
                {
                  key: 'child',
                  label: 'Caso',
                  render: (row) => `${row.child.firstName} ${row.child.lastName}`,
                },
                {
                  key: 'amount',
                  label: 'Monto',
                  render: (row) => formatCurrency(row.amount),
                },
                {
                  key: 'dueDate',
                  label: 'Vencimiento',
                  render: (row) => (row.dueDate ? formatDate(row.dueDate) : 'Sin fecha'),
                },
                { key: 'status', label: 'Estado' },
              ]}
              rows={payments}
            />
          </div>
        </PanelCard>

        <PanelCard>
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Asistencias</h2>
          <div className="mt-6">
            <DataTable
              columns={[
                {
                  key: 'session',
                  label: 'Sesión',
                  render: (row) => `${row.session.child.firstName} ${row.session.child.lastName}`,
                },
                {
                  key: 'registeredAt',
                  label: 'Registro',
                  render: (row) => formatDateTime(row.registeredAt),
                },
                { key: 'status', label: 'Estado' },
                { key: 'notes', label: 'Notas' },
              ]}
              rows={attendances}
            />
          </div>
        </PanelCard>
      </div>
    </div>
  )
}
