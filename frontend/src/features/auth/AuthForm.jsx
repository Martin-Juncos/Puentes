import { useState } from 'react'
import { FiEye, FiEyeOff, FiLock, FiLogIn, FiMail } from 'react-icons/fi'

import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'

export const AuthForm = ({
  onSuccess,
  submitLabel = 'Ingresar al panel',
  emailHint,
  passwordHint,
}) => {
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const updateField = (field) => (event) =>
    setCredentials((current) => ({
      ...current,
      [field]: event.target.value,
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const sessionUser = await login(credentials)
      await onSuccess?.(sessionUser)
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <Field hint={emailHint} label="Correo">
        <div className="relative">
          <FiMail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[rgba(47,93,115,0.55)]"
          />
          <input
            className="field-input field-input-with-icon"
            onChange={updateField('email')}
            placeholder="equipo@puentes.local"
            required
            type="email"
            value={credentials.email}
          />
        </div>
      </Field>

      <Field hint={passwordHint} label="Contraseña">
        <div className="relative">
          <FiLock
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[rgba(47,93,115,0.55)]"
          />
          <input
            className="field-input field-input-with-icon field-input-with-action"
            onChange={updateField('password')}
            placeholder="Tu contraseña"
            required
            type={isPasswordVisible ? 'text' : 'password'}
            value={credentials.password}
          />
          <button
            aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-[rgba(47,93,115,0.68)] transition-colors hover:bg-[rgba(47,93,115,0.08)] hover:text-[var(--color-primary)]"
            onClick={() => setIsPasswordVisible((current) => !current)}
            type="button"
          >
            {isPasswordVisible ? (
              <FiEyeOff aria-hidden="true" className="size-4" />
            ) : (
              <FiEye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </Field>

      {error ? (
        <div className="rounded-2xl bg-[rgba(217,140,122,0.18)] px-4 py-3 text-sm text-[#8b4b3d]">
          {error}
        </div>
      ) : null}

      <Button className="gap-2" disabled={isSubmitting} type="submit">
        <FiLogIn aria-hidden="true" className="size-4" />
        {isSubmitting ? 'Ingresando...' : submitLabel}
      </Button>
    </form>
  )
}
