const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value) {
  if (!value.trim()) return 'Email is required'
  if (!EMAIL_PATTERN.test(value.trim())) return 'Please enter a valid email address'
  return null
}

export function validatePassword(value) {
  if (!value) return 'Password is required'
  if (value.length < 3) return 'Password must be at least 3 characters'
  return null
}

export function validateUsername(value) {
  if (!value.trim()) return 'Username is required'
  if (value.trim().length < 3) return 'Username must be at least 3 characters'
  return null
}

export function validatePasswordConfirmation(value, password) {
  if (!value) return 'Please confirm your password'
  if (value !== password) return 'Passwords do not match'
  return null
}

export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const AVATAR_MAX_SIZE = 2 * 1024 * 1024

export function validateAvatar(file) {
  if (!file) return null
  if (!AVATAR_TYPES.includes(file.type)) return 'Avatar must be a JPG, PNG or WEBP image'
  if (file.size > AVATAR_MAX_SIZE) return 'Avatar must be smaller than 2MB'
  return null
}
