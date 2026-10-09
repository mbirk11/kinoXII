import { useEffect, useState } from 'react'
import Avatar from '../../components/Avatar/Avatar'
import Button from '../../components/Button/Button'
import Input from '../../components/Input/Input'
import useAuth from '../../hooks/useAuth'
import useFilterOptions from '../../hooks/useFilterOptions'
import useForm from '../../hooks/useForm'
import { updateProfile } from '../../api/profile'
import { toDateKey } from '../../utils/format'
import {
  getAge,
  validateAvatar,
  validateDateOfBirth,
  validateFullName,
  validateMobileNumber,
} from '../../utils/validation'
import checkIcon from '../../assets/icons/check.svg'
import caretIcon from '../../assets/icons/caret-down.svg'
import styles from './ProfilePage.module.css'

const validate = (values) => ({
  fullName: validateFullName(values.fullName),
  mobileNumber: validateMobileNumber(values.mobileNumber),
  dateOfBirth: validateDateOfBirth(values.dateOfBirth),
})

// "599123456" -> "599 123 456"
const formatMobile = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 9)
    .replace(/^(\d{3})(\d{1,3})?(\d{1,3})?$/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '))

const toFormValues = (user) => ({
  fullName: user.fullName ?? '',
  mobileNumber: formatMobile(user.mobileNumber ?? ''),
  dateOfBirth: user.dateOfBirth ?? '',
  preferredVenueId: user.preferredVenue?.id ? String(user.preferredVenue.id) : '',
})

function AgeNotice({ user }) {
  if (user.age == null) return null
  const canBookAll = user.age >= 18
  const blocked = user.age < 16 ? '16+ or 18+' : '18+'

  return (
    <p className={styles.ageNotice}>
      {canBookAll
        ? `You are ${user.age}, you can buy tickets for all age ratings.`
        : `You are ${user.age}, so you cannot buy tickets for ${blocked} titles.`}
    </p>
  )
}

function PersonalInfoForm() {
  const { user, setUser } = useAuth()
  const { data: options } = useFilterOptions()
  const form = useForm(toFormValues(user), validate)
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarError, setAvatarError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const saved = toFormValues(user)
  const isDirty =
    Boolean(avatar) || Object.keys(saved).some((key) => form.values[key] !== saved[key])
  const canSave = isDirty && form.isValid && !avatarError && !isSaving

  const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    const error = validateAvatar(file)
    setAvatarError(error)
    if (error) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!canSave) {
      form.touchAll()
      return
    }

    setIsSaving(true)
    setStatus(null)
    try {
      const updated = await updateProfile({
        fullName: form.values.fullName.trim(),
        mobileNumber: form.values.mobileNumber.replace(/\s/g, ''),
        dateOfBirth: form.values.dateOfBirth,
        preferredVenueId: form.values.preferredVenueId,
        avatar,
      })
      setUser(updated)
      setAvatar(null)
      setAvatarPreview(null)
      setStatus({ type: 'success', message: 'Your profile has been saved.' })
    } catch (error) {
      if (error.errors) {
        const { avatar: avatarApiError, preferredVenueId, ...fieldErrors } = error.errors
        if (avatarApiError) setAvatarError(avatarApiError[0])
        form.applyServerErrors(fieldErrors)
        if (preferredVenueId) setStatus({ type: 'error', message: preferredVenueId[0] })
      } else {
        setStatus({ type: 'error', message: error.message })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const previewUser = avatarPreview ? { ...user, avatar: avatarPreview } : user

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {user.profileComplete ? (
        <div className={`${styles.banner} ${styles.bannerComplete}`}>
          Profile Complete
          <img src={checkIcon} alt="" width="16" height="16" />
        </div>
      ) : (
        <div className={`${styles.banner} ${styles.bannerIncomplete}`} role="status">
          Please complete your profile to enable booking.
        </div>
      )}

      <div className={styles.avatarField}>
        <label className={styles.avatarUpload}>
          <Avatar user={previewUser} size={56} />
          <span className={styles.avatarText}>
            <span className={styles.avatarTitle}>Change avatar</span>
            <span className={styles.avatarHint}>JPG, PNG or WEBP, up to 2MB</span>
          </span>
          <input
            type="file"
            className={styles.hiddenInput}
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
          />
        </label>
        {avatarError && <p className={styles.fieldError}>{avatarError}</p>}
      </div>

      <Input label="Full name" placeholder="e.g. Nino Beridze" autoComplete="name" {...form.getFieldProps('fullName')} />

      <div className={styles.readonlyField}>
        <Input label="Email" value={user.email} disabled readOnly />
        <p className={styles.fieldHint}>Set at registration and cannot be changed</p>
      </div>

      <Input
        label="Mobile number"
        inputMode="numeric"
        placeholder="e.g. 555 123 456"
        autoComplete="tel"
        {...form.getFieldProps('mobileNumber')}
        onChange={(event) => form.setValue('mobileNumber', formatMobile(event.target.value))}
      />

      <div>
        <Input
          label="Date of birth"
          type="date"
          max={toDateKey(new Date())}
          {...form.getFieldProps('dateOfBirth')}
        />
        {form.values.dateOfBirth && !form.getError('dateOfBirth') && (
          <AgeNotice user={{ ...user, age: getAge(form.values.dateOfBirth) }} />
        )}
      </div>

      <label className={styles.selectField}>
        <span className={styles.selectLabel}>Preferred Venue (Optional)</span>
        <span className={styles.selectControl}>
          <select
            className={styles.select}
            name="preferredVenueId"
            value={form.values.preferredVenueId}
            onChange={(event) => form.setValue('preferredVenueId', event.target.value)}
          >
            <option value="">No preference</option>
            {options?.venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name} · {venue.city}
              </option>
            ))}
          </select>
          <img src={caretIcon} alt="" width="16" height="16" />
        </span>
      </label>

      {status && (
        <p className={status.type === 'success' ? styles.saved : styles.fieldError} role="status">
          {status.message}
        </p>
      )}

      <Button type="submit" className={styles.saveButton} disabled={!canSave}>
        {isSaving ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}

export default PersonalInfoForm
