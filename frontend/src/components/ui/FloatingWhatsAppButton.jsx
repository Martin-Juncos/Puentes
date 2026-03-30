import { FiMessageCircle } from 'react-icons/fi'

export const FloatingWhatsAppButton = ({ href }) => {
  if (!href) {
    return null
  }

  return (
    <a
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-transparent bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold !text-white shadow-[0_18px_42px_rgba(47,93,115,0.26)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-focus-ring)] sm:bottom-6 sm:right-6 sm:px-5"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <FiMessageCircle aria-hidden="true" className="size-5" />
      <span>WhatsApp</span>
    </a>
  )
}
