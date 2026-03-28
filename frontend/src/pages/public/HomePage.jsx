import { motion } from 'motion/react'
import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PanelCard } from '@/components/ui/PanelCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatCard } from '@/components/ui/StatCard'
import { homeSections, institutionalHighlights, publicStats } from '@/constants/siteContent'

const MotionDiv = motion.div

export const HomePage = () => (
  <div>
    <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
      <div className="flex flex-col justify-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
          Plataforma institucional y operativa
        </p>
        <h1 className="heading-display mt-6 max-w-3xl text-5xl font-semibold leading-none text-[var(--color-primary)] md:text-7xl">
          Acompañar el desarrollo también implica construir buenos puentes.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[rgba(46,46,46,0.74)]">
          Puentes fortalece la presencia institucional del centro y ordena su operación cotidiana con una experiencia pública clara y un panel interno diseñado para agenda, seguimiento, asistencia y comunicación.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button as={NavLink} to="/contacto">
            Quiero hacer una consulta
          </Button>
          <Button as={NavLink} to="/sobre-puentes" variant="outline">
            Conocer la propuesta
          </Button>
        </div>
      </div>

      <MotionDiv
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
        initial={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 rounded-[2.5rem] bg-[linear-gradient(160deg,rgba(47,93,115,0.18),rgba(167,196,181,0.12),rgba(217,140,122,0.16))]" />
        <div className="relative grid gap-5 rounded-[2.5rem] border border-white/60 bg-white/70 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl md:grid-cols-[1.15fr_0.85fr]">
          <img
            alt="Espacio de trabajo y acompañamiento"
            className="h-full min-h-80 w-full rounded-[2rem] object-cover"
            src="/media/0.jpg"
          />
          <div className="grid gap-5">
            <img alt="Materiales del centro" className="h-40 w-full rounded-[1.7rem] object-cover" src="/media/6.jpg" />
            <img
              alt="Imagen institucional del espacio"
              className="h-52 w-full rounded-[1.7rem] object-cover"
              src="/media/7.jpg"
            />
          </div>
        </div>
      </MotionDiv>
    </section>

    <section className="mx-auto grid max-w-7xl gap-5 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
      {publicStats.map((stat, index) => (
        <StatCard accent={index === 0} key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </section>

    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        description="La plataforma nace con una dualidad explícita: sostener la imagen institucional del centro y ordenar la operación interna diaria sin convertir la experiencia en un simple sistema de turnos."
        eyebrow="Doble foco"
        title="Una sola identidad, dos capas claramente diferenciadas."
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {institutionalHighlights.map((item) => (
          <PanelCard className="bg-white/80" key={item.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(47,93,115,0.6)]">{item.eyebrow}</p>
            <h3 className="heading-display mt-4 text-3xl font-semibold text-[var(--color-primary)]">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[rgba(46,46,46,0.72)]">{item.description}</p>
          </PanelCard>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {homeSections.map((item, index) => (
          <PanelCard className={index === 1 ? 'bg-[rgba(47,93,115,0.92)] text-white' : ''} key={item.title}>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className={`mt-4 text-sm leading-7 ${index === 1 ? 'text-white/78' : 'text-[rgba(46,46,46,0.72)]'}`}>
              {item.description}
            </p>
          </PanelCard>
        ))}
      </div>
    </section>
  </div>
)
