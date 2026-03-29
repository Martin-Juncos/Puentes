import { useEffect, useRef } from 'react'

export const usePolling = (callback, { enabled = true, intervalMs = 30000 } = {}) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const run = () => {
      Promise.resolve(callbackRef.current?.()).catch(() => {})
    }

    const intervalId = window.setInterval(run, intervalMs)
    const handleFocus = () => run()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        run()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, intervalMs])
}
