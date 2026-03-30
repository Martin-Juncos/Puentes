import { useState } from 'react'
import { FiEye, FiEyeOff, FiLock, FiLogIn, FiMail } from 'react-icons/fi'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { IconButton } from '@/components/ui/IconButton'
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
      <Field hint={emailHint} label="Correo" required>
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

      <Field hint={passwordHint} label="Contraseña" required>
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
          <IconButton
            aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 size-10 -translate-y-1/2 border-transparent bg-transparent text-[rgba(47,93,115,0.68)] shadow-none hover:bg-[rgba(47,93,115,0.08)] hover:text-[var(--color-primary)]"
            onClick={() => setIsPasswordVisible((current) => !current)}
            variant="ghost"
          >
            {isPasswordVisible ? (
              <FiEyeOff aria-hidden="true" className="size-4" />
            ) : (
              <FiEye aria-hidden="true" className="size-4" />
            )}
          </IconButton>
        </div>
      </Field>

      {error ? (
        <Alert title="No pudimos iniciar la sesión" tone="error">
          {error}
        </Alert>
      ) : null}

      <Button className="gap-2" disabled={isSubmitting} type="submit">
        <FiLogIn aria-hidden="true" className="size-4" />
        {isSubmitting ? 'Ingresando...' : submitLabel}
      </Button>
    </form>
  )
}
