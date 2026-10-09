// Signed-in users younger than the rating cannot book; guests are checked after login
export function getAgeBlockMessage(movie, user) {
  const minAge = movie.ageRating.minAge
  if (!user || user.age == null || minAge === 0 || user.age >= minAge) return null
  return `This film is rated ${movie.ageRating.code}. You cannot buy tickets for it with this account.`
}
