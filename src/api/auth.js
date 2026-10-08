import { apiRequest } from './client'

export async function login({ email, password }) {
  const { data } = await apiRequest('/login', {
    method: 'POST',
    body: { email, password },
    skipAuthHandler: true,
  })
  return data
}

export async function register({ username, email, password, passwordConfirmation, avatar }) {
  const formData = new FormData()
  formData.append('username', username)
  formData.append('email', email)
  formData.append('password', password)
  formData.append('password_confirmation', passwordConfirmation)
  if (avatar) {
    formData.append('avatar', avatar)
  }

  const { data } = await apiRequest('/register', { method: 'POST', body: formData })
  return data
}

export function logout() {
  return apiRequest('/logout', { method: 'POST', skipAuthHandler: true })
}

export async function getMe() {
  const { data } = await apiRequest('/me', { skipAuthHandler: true })
  return data
}
