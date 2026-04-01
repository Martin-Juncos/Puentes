import { useEffect, useRef, useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi'

import { cn } from '@/utils/cn'

const formatCounter = (value) => String(value).padStart(2, '0')
const AUTOPLAY_INTERVAL_MS = 4000
const SWIPE_THRESHOLD_PX = 40

export const HomeSignalsCarousel = ({
  items,
  badgeLabel = 'Acompañamiento',
  footerText = 'Puentes trabaja con claridad, continuidad y cercanía',
  nextLabel = 'Siguiente señal',
  prevLabel = 'Señal anterior',
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartXRef = useRef(null)
  const touchDeltaXRef = useRef(0)
  const currentIndex = items.length ? Math.min(activeIndex, items.length - 1) : 0

  useEffect(() => {
    if (isPaused || items.length < 2) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentValue) => ((Math.min(currentValue, items.length - 1) + 1) % items.length))
    }, AUTOPLAY_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isPaused, items.length])

  const goToSlide = (index) => {
    setActiveIndex(index)
  }

  const goToPrevious = () => {
    setActiveIndex((currentValue) => ((Math.min(currentValue, items.length - 1) - 1 + items.length) % items.length))
  }

  const goToNext = () => {
    setActiveIndex((currentValue) => ((Math.min(currentValue, items.length - 1) + 1) % items.length))
  }

  const handleTouchStart = (event) => {
    const firstTouch = event.touches[0]

    if (!firstTouch) {
      return
    }

    touchStartXRef.current = firstTouch.clientX
    touchDeltaXRef.current = 0
  }

  const handleTouchMove = (event) => {
    const firstTouch = event.touches[0]

    if (!firstTouch || touchStartXRef.current === null) {
      return
    }

    touchDeltaXRef.current = firstTouch.clientX - touchStartXRef.current
  }

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null) {
      return
    }

    if (Math.abs(touchDeltaXRef.current) >= SWIPE_THRESHOLD_PX) {
      if (touchDeltaXRef.current > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }

    touchStartXRef.current = null
    touchDeltaXRef.current = 0
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToPrevious()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToNext()
    }
  }

  const handleBlur = (event) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return
    }

    setIsPaused(false)
  }

  if (!items.length) {
    return null
  }

  return (
    <div className="mt-8">
      <section
        aria-label="Señales de acompañamiento"
        className="home-signals-carousel overflow-hidden rounded-[2rem] border border-[rgba(47,93,115,0.12)] bg-white/88 shadow-[0_24px_70px_rgba(47,93,115,0.12)] backdrop-blur"
      >
        <div
          className="home-signals-carousel__viewport"
          onBlur={handleBlur}
          onFocusCapture={() => setIsPaused(true)}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          tabIndex={0}
        >
          <div className="home-signals-carousel__slides">
            {items.map((item, index) => (
              <article
                aria-hidden={index !== currentIndex}
                className={cn('home-signals-carousel__item', index === currentIndex && 'is-active')}
                key={`${item.title}-${index}`}
              >
                <div className="home-signals-carousel__media">
                  <img alt={item.imageAlt} className="home-signals-carousel__image" src={item.image} />
                </div>

                <div className="home-signals-carousel__caption">
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
                </div>
              </article>
            ))}
          </div>

          {items.length > 1 ? (
            <>
              <button
                aria-label={prevLabel}
                className="home-signals-carousel__nav home-signals-carousel__nav--prev"
                onClick={goToPrevious}
                type="button"
              >
                <span aria-hidden="true" className="home-signals-carousel__control">
                  <FiArrowLeft className="size-5" />
                </span>
              </button>

              <button
                aria-label={nextLabel}
                className="home-signals-carousel__nav home-signals-carousel__nav--next"
                onClick={goToNext}
                type="button"
              >
                <span aria-hidden="true" className="home-signals-carousel__control">
                  <FiArrowRight className="size-5" />
                </span>
              </button>

              <div className="home-signals-carousel__indicators" role="tablist">
                {items.map((item, index) => (
                  <button
                    aria-label={`Ir a ${item.title}`}
                    aria-pressed={index === currentIndex}
                    className={cn(
                      'home-signals-carousel__indicator',
                      index === currentIndex && 'is-active',
                    )}
                    key={`${item.title}-indicator-${index}`}
                    onClick={() => goToSlide(index)}
                    type="button"
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  )
}
