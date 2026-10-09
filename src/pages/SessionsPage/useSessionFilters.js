import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toDateKey } from '../../utils/format'

export const DEFAULT_SORT = 'time_asc'

// URL key for each list filter, e.g. ?venue=galleria,vake&format=max
const LIST_PARAMS = {
  venues: 'venue',
  formats: 'format',
  languages: 'language',
  bands: 'time',
}

const parseList = (value) => (value ? value.split(',').filter(Boolean) : [])

function toSearchParams(filters, today) {
  const params = new URLSearchParams()
  Object.entries(LIST_PARAMS).forEach(([key, param]) => {
    if (filters[key].length) params.set(param, filters[key].join(','))
  })
  if (filters.date !== today) params.set('date', filters.date)
  if (filters.search) params.set('search', filters.search)
  if (filters.sort !== DEFAULT_SORT) params.set('sort', filters.sort)
  if (filters.page > 1) params.set('page', String(filters.page))
  return params
}

// The whole sessions view lives in the query string, so links, refresh and back/forward work
function useSessionFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const today = toDateKey(new Date())

  const filters = useMemo(() => {
    const page = Number.parseInt(searchParams.get('page'), 10)
    return {
      venues: parseList(searchParams.get(LIST_PARAMS.venues)),
      formats: parseList(searchParams.get(LIST_PARAMS.formats)),
      languages: parseList(searchParams.get(LIST_PARAMS.languages)),
      bands: parseList(searchParams.get(LIST_PARAMS.bands)),
      date: searchParams.get('date') || today,
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || DEFAULT_SORT,
      page: page > 0 ? page : 1,
    }
  }, [searchParams, today])

  // Any filter or sort change sends the user back to page 1
  const updateFilters = useCallback(
    (changes, { replace = false } = {}) => {
      const next = { ...filters, page: 1, ...changes }
      setSearchParams(toSearchParams(next, today), { replace })
    },
    [filters, setSearchParams, today],
  )

  const activeFilterCount =
    filters.venues.length + filters.formats.length + filters.languages.length + filters.bands.length

  // Clears everything except the date (and keeps the chosen sort)
  const clearFilters = useCallback(
    () => updateFilters({ venues: [], formats: [], languages: [], bands: [], search: '' }),
    [updateFilters],
  )

  return { filters, updateFilters, clearFilters, activeFilterCount, today }
}

export default useSessionFilters
