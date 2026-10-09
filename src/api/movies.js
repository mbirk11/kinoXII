import { apiRequest } from './client'

export async function getFeaturedMovies() {
  const { data } = await apiRequest('/movies/featured')
  return data
}

export async function getNowPlaying({ limit } = {}) {
  const { data } = await apiRequest('/movies/now-playing', { params: { limit } })
  return data
}

export async function getComingSoon({ limit } = {}) {
  const { data } = await apiRequest('/movies/coming-soon', { params: { limit } })
  return data
}

export async function subscribeToMovie(slug) {
  const { data } = await apiRequest(`/movies/${slug}/notify`, { method: 'POST' })
  return data
}

export async function searchMovies(query) {
  const { data } = await apiRequest('/search', { params: { q: query } })
  return data
}
