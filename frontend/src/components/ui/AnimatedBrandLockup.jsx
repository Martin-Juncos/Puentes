import { createScope, createTimeline, splitText, stagger } from 'animejs'
import { useEffect, useRef } from 'react'

import { cn } from '@/utils/cn'

export const AnimatedBrandLockup = ({
  className,
  eyebrow = 'Centro interdisciplinario',
  title = 'Puentes',
  logoAlt,
  logoSrc,
}) => {
  const rootRef = useRef(null)
  const scopeRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (!rootRef.current || !titleRef.current) {
      return undefined
    }

    scopeRef.current = createScope({
      root: rootRef,
      mediaQueries: {
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
    }).add((self) => {
      if (self.matches.reduceMotion) {
        return undefined
      }

      const split = splitText(titleRef.current, {
        chars: {
          wrap: 'clip',
          clone: 'bottom',
        },
      })

      createTimeline({
        defaults: {
          duration: 1320,
          ease: 'inOut(3)',
        },
        loop: true,
        loopDelay: 3000,
      })
        .add(split.chars, {
          y: '-100%',
          delay: stagger(54, { from: 'center' }),
        })
        .init()

      return () => {
        split.revert()
      }
    })

    return () => {
      scopeRef.current?.revert()
      scopeRef.current = null
    }
  }, [])

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)} ref={rootRef}>
      <img alt={logoAlt} className="h-14 w-14 rounded-full bg-white/80 p-1 sm:h-16 sm:w-16" src={logoSrc} />
      <div className="min-w-0">
        <p className="truncate text-[clamp(2.1rem,6.8vw,4rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-[var(--color-primary)]">
          <span className="inline-block whitespace-nowrap" ref={titleRef}>
            {title}
          </span>
        </p>
        <p className="-mt-0.5 pl-0.5 text-[0.56rem] uppercase leading-none tracking-[0.42em] text-[rgba(47,93,115,0.6)] sm:text-[0.64rem]">
          {eyebrow}
        </p>
      </div>
    </div>
  )
}
