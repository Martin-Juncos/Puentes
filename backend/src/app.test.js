import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { app } from './app.js'

describe('backend app', () => {
  it('expone el healthcheck del API', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: {
        status: 'ok',
      },
    })
  })

  it('responde con el contrato de error estandarizado en rutas inexistentes', async () => {
    const response = await request(app).get('/api/ruta-inexistente')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'No se encontró la ruta /api/ruta-inexistente.',
        details: undefined,
      },
    })
  })
})
