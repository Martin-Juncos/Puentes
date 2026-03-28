export const buildWhatsappUrl = (baseUrl, message) => {
  if (!baseUrl) {
    return null
  }

  const connector = baseUrl.includes('?') ? '&' : '?'

  return `${baseUrl}${connector}text=${encodeURIComponent(message)}`
}
