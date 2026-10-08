import { useEffect, useState } from 'react'
import Modal from '../Modal/Modal'
import Input from '../Input/Input'
import Button from '../Button/Button'
import useAuth from '../../hooks/useAuth'
import useForm from '../../hooks/useForm'
import {
  validateAvatar,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateUsername,
} from '../../utils/validation'
import uploadIcon from '../../assets/icons/upload.svg'
import styles from './AuthModals.module.css'

const validate = (values) => ({
  username: validateUsername(values.username),
  email: validateEmail(values.email),
  password: validatePassword(values.password),
  passwordConfirmation: validatePasswordConfirmation(
    values.passwordConfirmation,
    values.password,
  ),
})

const initialValues = { username: '', email: '', password: '', passwordConfirmation: '' }

function RegisterModal({ isOpen }) {
  const { register, closeAuthModal, openLogin } = useAuth()
  const form = useForm(initialValues, validate)
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [avatarError, setAvatarError] = useState(null)
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Free the previous preview URL when it changes or the modal closes
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

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
    if (!form.isValid || avatarError || isSubmitting) {
      form.touchAll()
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    try {
      await register({
        username: form.values.username.trim(),
        email: form.values.email.trim(),
        password: form.values.password,
        passwordConfirmation: form.values.passwordConfirmation,
        avatar,
      })
    } catch (error) {
      if (error.errors) {
        const { avatar: avatarApiError, ...fieldErrors } = error.errors
        if (avatarApiError) setAvatarError(avatarApiError[0])
        form.applyServerErrors(fieldErrors, { password_confirmation: 'passwordConfirmation' })
      } else {
        setFormError(error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAuthModal}
      title="Sign up"
      subtitle="Welcome to Kino XII"
      className={styles.register}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.avatarField}>
          <label className={styles.avatarUpload}>
            <span className={styles.avatarBox}>
              {avatarPreview ? (
                <img className={styles.avatarPreview} src={avatarPreview} alt="Avatar preview" />
              ) : (
                <img src={uploadIcon} alt="" width="12" height="11" />
              )}
            </span>
            <span className={styles.avatarText}>
              <span className={styles.avatarTitle}>Upload avatar (optional)</span>
              <span className={styles.avatarHint}>JPG, PNG or WEBP</span>
            </span>
            <input
              type="file"
              className={styles.hiddenInput}
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
            />
          </label>
          {avatarError && <p className={styles.avatarError}>{avatarError}</p>}
        </div>

        <div className={styles.fields}>
          <Input
            label="Username"
            placeholder="User"
            autoComplete="username"
            autoFocus
            {...form.getFieldProps('username')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            {...form.getFieldProps('email')}
          />
          <div className={styles.row}>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...form.getFieldProps('password')}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              {...form.getFieldProps('passwordConfirmation')}
            />
          </div>
        </div>

        <div className={styles.footer}>
          {formError && (
            <p className={styles.formError} role="alert">
              {formError}
            </p>
          )}
          <Button
            type="submit"
            className={styles.submit}
            disabled={!form.isValid || Boolean(avatarError) || isSubmitting}
          >
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
          <p className={styles.switch}>
            Already have an account?
            <button type="button" className={styles.switchLink} onClick={openLogin}>
              Log in
            </button>
          </p>
        </div>
      </form>
    </Modal>
  )
}

export default RegisterModal
