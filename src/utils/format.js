export function formatPrice(amount) {
  return `₾ ${Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

// "Thriller · 102 min"
export function formatMovieMeta(movie) {
  const genre = movie.genres?.[0]?.name
  return [genre, `${movie.runtimeMinutes} min`].filter(Boolean).join(' · ')
}

// "2 October"
export function formatDayMonth(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  })
}

// "15 Sept"
export function formatShortDayMonth(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

// "2026-10-09" in local time
export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Today plus the following days, as date keys
export function getUpcomingDates(count = 7) {
  const today = new Date()
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset)
    return toDateKey(date)
  })
}

// { weekday: "Mon", day: "15" }
export function getDayParts(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`)
  return {
    weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
    day: String(date.getDate()),
  }
}
