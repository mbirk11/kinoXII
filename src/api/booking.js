import { apiRequest } from './client'

export async function getSession(sessionId) {
  const { data } = await apiRequest(`/sessions/${sessionId}`)
  return data
}

export async function getSeatMap(sessionId) {
  const { data } = await apiRequest(`/sessions/${sessionId}/seats`)
  return data
}

// seats: [{ seatId, ticketType }]
export async function holdSeats(sessionId, seats) {
  const { data } = await apiRequest(`/sessions/${sessionId}/holds`, {
    method: 'POST',
    body: { seats },
  })
  return data
}

export function releaseHold(holdId) {
  return apiRequest(`/holds/${holdId}`, { method: 'DELETE', skipAuthHandler: true })
}

export async function createOrder(payload) {
  const { data } = await apiRequest('/orders', { method: 'POST', body: payload })
  return data
}
