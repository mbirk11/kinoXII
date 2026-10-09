// Child tickets are refused when the film's minimum age reaches the type's block age
export function isTicketTypeBlocked(ticketType, movie) {
  return (
    ticketType.blockedFromRatingAge != null &&
    movie.ageRating.minAge >= ticketType.blockedFromRatingAge
  )
}

// Session price is the adult price; other types scale by their ratio from /filter-options
export function getSeatPrice(session, ticketTypes, slug) {
  const ratio = ticketTypes.find((type) => type.slug === slug)?.priceRatio ?? 1
  return Math.round(session.price * ratio * 100) / 100
}

// "2 x Adult, 1 x Child"
export function summarizeTicketTypes(items, getName) {
  const counts = new Map()
  items.forEach((item) => {
    const name = getName(item)
    counts.set(name, (counts.get(name) ?? 0) + 1)
  })
  return [...counts].map(([name, count]) => `${count} x ${name}`).join(', ')
}
