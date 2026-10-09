import { apiRequest } from './client'

// Avatar uploads need multipart, which Laravel accepts on POST with _method=PUT
export async function updateProfile({ fullName, mobileNumber, dateOfBirth, preferredVenueId, avatar }) {
  const fields = { fullName, mobileNumber, dateOfBirth, preferredVenueId: preferredVenueId || null }

  if (avatar) {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value)
    })
    formData.append('avatar', avatar)
    const { data } = await apiRequest('/profile', { method: 'POST', body: formData })
    return data
  }

  const { data } = await apiRequest('/profile', { method: 'PUT', body: fields })
  return data
}

export async function getTickets(filter) {
  const { data } = await apiRequest('/tickets', { params: { filter } })
  return data
}

// The path key is the order reference (KX-...), not the numeric id
export async function refundOrder(reference) {
  const { data } = await apiRequest(`/orders/${reference}/refund`, { method: 'POST' })
  return data
}
