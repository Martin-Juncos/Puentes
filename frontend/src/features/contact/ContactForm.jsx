import { useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { contactService } from '@/services/contactService'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
}

const resolveContactErrorMessage = (error) => {
  const firstDetail = error.details?.[0]

  if (firstDetail?.message) {
    return firstDetail.message
  }

  return error.message
}

export const ContactForm = () => {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState({ type: null, message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await contactService.create(form)
      setStatus({
        type: 'success',
        message: 'Tu consulta fue enviada. Te responderemos a la brevedad.',
      })
      setForm(initialState)
    } catch (error) {
      setStatus({
        type: 'error',
        message: resolveContactErrorMessage(error),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nombre y apellido" required>
          <input className="field-input" minLength={3} onChange={updateField('fullName')} required value={form.fullName} />
        </Field>
        <Field label="Email" required>
          <input
            className="field-input"
            onChange={updateField('email')}
            required
            type="email"
            value={form.email}
          />
        </Field>
      </div>

      <Field hint="Opcional, para que podamos contactarte más rápido." label="Teléfono">
        <input className="field-input" onChange={updateField('phone')} value={form.phone} />
      </Field>

      <Field label="Mensaje" required>
        <textarea
          className="field-input min-h-36"
          minLength={10}
          onChange={updateField('message')}
          required
          value={form.message}
        />
      </Field>

      {status.type ? (
        <Alert title={status.type === 'success' ? 'Consulta enviada' : 'No pudimos enviar tu consulta'} tone={status.type}>
          {status.message}
        </Alert>
      ) : null}

      <Button className="w-full sm:w-fit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
      </Button>
    </form>
  )
}
