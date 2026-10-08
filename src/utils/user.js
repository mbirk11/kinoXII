export function getDisplayName(user) {
  return user?.fullName || user?.username || ''
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}
