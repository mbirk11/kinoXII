const STORAGE_KEY = 'kinoxii_recently_viewed'
const MAX_ITEMS = 6

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

// Call when a film's detail page opens; newest first, no duplicates
export function addRecentlyViewed(movie) {
  const entry = {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    runtimeMinutes: movie.runtimeMinutes,
    genres: movie.genres,
    ageRating: movie.ageRating,
  }
  const items = [entry, ...getRecentlyViewed().filter((item) => item.id !== movie.id)]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
}
