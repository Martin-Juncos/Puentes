export const LoadingScreen = ({ message = 'Cargando...' }) => (
  <div className="flex min-h-screen items-center justify-center panel-gradient">
    <div className="surface-card max-w-md px-8 py-10 text-center">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[rgba(47,93,115,0.14)] border-t-[var(--color-primary)]" />
      <p className="mt-5 text-sm font-medium text-[var(--color-primary)]">{message}</p>
    </div>
  </div>
)
