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
