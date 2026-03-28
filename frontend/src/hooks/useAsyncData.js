import { useEffect, useState } from 'react'

export const useAsyncData = (loader, dependencies = []) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setIsLoading(true)

    try {
      const result = await loader()
      setData(result)
      setError(null)
    } catch (loadError) {
      setError(loadError)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return { data, setData, isLoading, error, reload: load }
}
