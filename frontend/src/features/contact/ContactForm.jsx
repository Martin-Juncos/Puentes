import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { contactService } from '@/services/contactService'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  message: '',
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
        message: error.message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nombre y apellido">
          <input className="field-input" onChange={updateField('fullName')} required value={form.fullName} />
        </Field>
        <Field label="Email">
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

      <Field label="Mensaje">
        <textarea
          className="field-input min-h-36 resize-y"
          onChange={updateField('message')}
          required
          value={form.message}
        />
      </Field>

      {status.type ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            status.type === 'success'
              ? 'bg-[rgba(167,196,181,0.22)] text-[var(--color-primary)]'
              : 'bg-[rgba(217,140,122,0.18)] text-[#8b4b3d]'
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <Button className="w-full sm:w-fit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
      </Button>
    </form>
  )
}
