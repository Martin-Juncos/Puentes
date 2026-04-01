const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api'

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return null
}

const request = async (path, options = {}) => {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    })
  } catch (error) {
    const networkError = new Error(
      'No pudimos conectar el formulario con el servidor. Si el problema sigue, probá por WhatsApp o email.',
    )
    networkError.code = 'NETWORK_ERROR'
    networkError.cause = error
    throw networkError
  }

  const payload = await parseResponse(response)

  if (!response.ok) {
    const error = new Error(payload?.error?.message ?? 'Ocurrió un error al comunicarse con la API.')
    error.code = payload?.error?.code
    error.details = payload?.error?.details
    throw error
  }

  return payload?.data
}

export const apiClient = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  patch: (path, body) =>
    request(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: (path) =>
    request(path, {
      method: 'DELETE',
    }),
}
