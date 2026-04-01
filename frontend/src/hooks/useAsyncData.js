import { useCallback, useEffect, useRef, useState } from 'react'

export const useAsyncData = (loader, dependencies = []) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const loaderRef = useRef(loader)
  const dependenciesKey = JSON.stringify(dependencies)

  useEffect(() => {
    loaderRef.current = loader
  }, [loader])

  const load = useCallback(async () => {
    setIsLoading(true)

    try {
      const result = await loaderRef.current()
      setData(result)
      setError(null)
    } catch (loadError) {
      setError(loadError)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load, dependenciesKey])

  return { data, setData, isLoading, error, reload: load }
}
