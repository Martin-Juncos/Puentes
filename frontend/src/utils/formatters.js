export const formatDateTime = (value) =>
  new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

export const formatDate = (value) =>
  new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
  }).format(new Date(value))

export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(value))
