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

export function validateFullName(value) {
  const name = value.trim()
  if (!name) return 'Name is required'
  if (name.length < 3) return 'Name must be at least 3 characters'
  if (name.length > 50) return 'Name must not exceed 50 characters'
  return null
}

// Georgian mobile: 9 digits starting with 5, spaces allowed while typing
export function validateMobileNumber(value) {
  const digits = value.replace(/\s/g, '')
  if (!digits) return 'Mobile number is required'
  if (!/^\d+$/.test(digits)) {
    return 'Please enter a valid Georgian mobile number (9 digits starting with 5)'
  }
  if (!digits.startsWith('5')) return 'Georgian mobile numbers must start with 5'
  if (digits.length !== 9) return 'Mobile number must be exactly 9 digits'
  return null
}

export function validateCardNumber(value) {
  const digits = value.replace(/\s/g, '')
  if (!digits) return 'Card number is required'
  if (!/^\d{16}$/.test(digits)) return 'Card number must be 16 digits'
  return null
}

export function validateExpiry(value) {
  if (!value) return 'Expiry date is required'
  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)
  if (!match) return 'Use the MM/YY format'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const now = new Date()
  const isPast =
    year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)
  if (isPast) return 'Card has expired'
  return null
}

export function validateCvv(value) {
  if (!value) return 'CVV is required'
  if (!/^\d{3}$/.test(value)) return 'CVV must be 3 digits'
  return null
}

const MIN_AGE = 12

export function getAge(dateOfBirth) {
  const birth = new Date(`${dateOfBirth}T00:00:00`)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  if (beforeBirthday) age -= 1
  return age
}

export function validateDateOfBirth(value) {
  if (!value) return 'Date of birth is required'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime()) || date > new Date()) return 'Please enter a valid date of birth'
  if (getAge(value) < MIN_AGE) return 'You must be at least 12 years old to create an account'
  return null
}
