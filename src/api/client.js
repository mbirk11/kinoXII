const API_URL =
  import.meta.env.VITE_API_URL ?? 'https://api.kinoxii.redberryinternship.ge/api'

const TOKEN_KEY = 'kinoxii_token'

export class ApiError extends Error {
  constructor(status, message, errors = null) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

let unauthorizedHandler = null

// Lets the auth layer react when a protected request comes back 401
export function onUnauthorized(handler) {
  unauthorizedHandler = handler
}

export async function apiRequest(path, { method = 'GET', body, params, skipAuthHandler } = {}) {
  const url = new URL(API_URL + path)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value)
      }
    })
  }

  const headers = { Accept: 'application/json' }
  const token = getToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const isFormData = body instanceof FormData
  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  let response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body && !isFormData ? JSON.stringify(body) : body,
    })
  } catch {
    throw new ApiError(0, 'Network error. Please check your connection and try again.')
  }

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && !skipAuthHandler && unauthorizedHandler) {
      unauthorizedHandler()
    }
    throw new ApiError(
      response.status,
      data?.message ?? 'Something went wrong. Please try again.',
      data?.errors ?? null,
    )
  }

  return data
}
