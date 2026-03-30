import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi'

const formatCounter = (value) => String(value).padStart(2, '0')

export const HomeSignalsCarousel = ({
  items,
  badgeLabel = 'Acompañamiento',
  footerText = 'Puentes trabaja con claridad, continuidad y cercanía',
  nextLabel = 'Siguiente señal',
  prevLabel = 'Señal anterior',
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!items.length) {
    return null
  }

  return (
    <div className="mt-8">
      <Carousel
        activeIndex={activeIndex}
        className="home-signals-carousel overflow-hidden rounded-[2rem] border border-[rgba(47,93,115,0.12)] bg-white/88 shadow-[0_24px_70px_rgba(47,93,115,0.12)] backdrop-blur"
        fade
        indicators
        interval={4000}
        nextIcon={
          <span aria-hidden="true" className="home-signals-carousel__control">
            <FiArrowRight className="size-5" />
          </span>
        }
        nextLabel={nextLabel}
        onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
        pause="hover"
        prevIcon={
          <span aria-hidden="true" className="home-signals-carousel__control">
            <FiArrowLeft className="size-5" />
          </span>
        }
        prevLabel={prevLabel}
        slide
        touch
        wrap
      >
        {items.map((item, index) => (
          <Carousel.Item className="home-signals-carousel__item" key={`${item.title}-${index}`}>
            <div className="home-signals-carousel__media">
              <img alt={item.imageAlt} className="home-signals-carousel__image" src={item.image} />
            </div>

            <Carousel.Caption className="home-signals-carousel__caption">
              <div className="home-signals-carousel__panel">
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(47,93,115,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    <FiCheckCircle aria-hidden="true" className="size-4" />
                    {item.badgeLabel ?? badgeLabel}
                  </div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-[rgba(47,93,115,0.52)]">
                    {formatCounter(index + 1)} / {formatCounter(items.length)}
                  </p>
                </div>

                <h2 className="mt-6 text-left text-3xl font-semibold leading-tight text-[var(--color-primary)] sm:text-[2.35rem]">
                  {item.title}
                </h2>
                <p className="mt-5 max-w-xl text-left text-base leading-8 text-[rgba(46,46,46,0.74)] sm:text-lg">
                  {item.description}
                </p>

                <div className="mt-8 flex items-center gap-3 text-left text-sm font-medium text-[rgba(47,93,115,0.64)]">
                  <span className="h-px flex-1 bg-[rgba(47,93,115,0.14)]" />
                  <span>{footerText}</span>
                </div>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  )
}
