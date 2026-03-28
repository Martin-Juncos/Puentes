import { Badge } from './Badge'

export const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => (
  <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
    {eyebrow ? <Badge>{eyebrow}</Badge> : null}
    <h2 className="heading-display mt-4 text-4xl font-semibold text-[var(--color-primary)] md:text-5xl">
      {title}
    </h2>
    {description ? (
      <p className="mt-4 text-base leading-7 text-[rgba(46,46,46,0.78)] md:text-lg">{description}</p>
    ) : null}
  </div>
)
