import { Alert } from '@/components/ui/Alert'

export const FormErrorAlert = ({ children, className, title = 'Revisá la información ingresada' }) => (
  <Alert className={className} title={title} tone="error">
    {children}
  </Alert>
)
