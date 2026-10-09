import { apiRequest } from './client'

let filterOptionsPromise = null

// Venues, formats, languages, sorts, ticket types... fetched once and reused
export function getFilterOptions() {
  if (!filterOptionsPromise) {
    filterOptionsPromise = apiRequest('/filter-options')
      .then(({ data }) => data)
      .catch((error) => {
        filterOptionsPromise = null
        throw error
      })
  }
  return filterOptionsPromise
}

export function getSessions({ date, venues, formats, languages, bands, search, sort, page }) {
  return apiRequest('/sessions', {
    params: {
      date,
      'venues[]': venues,
      'formats[]': formats,
      'languages[]': languages,
      'bands[]': bands,
      search,
      sort,
      page,
    },
  })
}
