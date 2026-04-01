import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAsyncData } from './useAsyncData'

describe('useAsyncData', () => {
  it('carga datos iniciales y vuelve a ejecutar cuando cambian las dependencias', async () => {
    const firstLoader = vi.fn().mockResolvedValue(['uno'])
    const secondLoader = vi.fn().mockResolvedValue(['dos'])

    const { result, rerender } = renderHook(
      ({ loader, dependencies }) => useAsyncData(loader, dependencies),
      {
        initialProps: {
          loader: firstLoader,
          dependencies: ['a'],
        },
      },
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(firstLoader).toHaveBeenCalledTimes(1)
    expect(result.current.data).toEqual(['uno'])
    expect(result.current.error).toBeNull()

    rerender({
      loader: secondLoader,
      dependencies: ['b'],
    })

    await waitFor(() => expect(result.current.data).toEqual(['dos']))

    expect(secondLoader).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
  })

  it('expone el error y permite recargar con la ultima funcion loader', async () => {
    const failingLoader = vi.fn().mockRejectedValue(new Error('fallo inicial'))
    const successLoader = vi.fn().mockResolvedValue(['ok'])

    const { result, rerender } = renderHook(
      ({ loader, dependencies }) => useAsyncData(loader, dependencies),
      {
        initialProps: {
          loader: failingLoader,
          dependencies: ['mismo'],
        },
      },
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toBe('fallo inicial')

    rerender({
      loader: successLoader,
      dependencies: ['mismo'],
    })

    await act(async () => {
      await result.current.reload()
    })

    await waitFor(() => expect(result.current.data).toEqual(['ok']))

    expect(successLoader).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
  })
})
