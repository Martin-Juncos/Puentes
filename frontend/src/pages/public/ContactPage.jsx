import { ContactForm } from '@/features/contact/ContactForm'
import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

const whatsappUrl =
  import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/5491100000000?text=Hola%20Puentes'

export const ContactPage = () => (
  <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
    <SectionHeading
      description="Podés escribirnos para orientación institucional, consultas iniciales o coordinación de una primera entrevista."
      eyebrow="Contacto"
      title="Abrimos un canal claro para escuchar, orientar y ordenar el primer paso."
    />

    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
      <PanelCard className="bg-white/85">
        <ContactForm />
      </PanelCard>

      <div className="grid gap-6">
        <PanelCard className="bg-[rgba(47,93,115,0.94)] text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">Contacto operativo</p>
          <h3 className="mt-4 text-3xl font-semibold">Canales del centro</h3>
          <div className="mt-6 grid gap-4 text-sm leading-7 text-white/82">
            <p>Buenos Aires, Argentina</p>
            <p>contacto@puentes.local</p>
            <p>+54 11 5555 0000</p>
          </div>
          <a
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-primary)]"
            href={whatsappUrl}
            rel="noreferrer"
            target="_blank"
          >
            Escribir por WhatsApp
          </a>
        </PanelCard>

        <img alt="Espacio de contacto y acompañamiento" className="h-80 w-full rounded-[2rem] object-cover" src="/media/9.jpg" />
      </div>
    </div>
  </div>
)
