import { useState } from 'react'
import Modal from '../Modal/Modal'
import Input from '../Input/Input'
import Button from '../Button/Button'
import useAuth from '../../hooks/useAuth'
import useForm from '../../hooks/useForm'
import { validateEmail, validatePassword } from '../../utils/validation'
import styles from './AuthModals.module.css'

const validate = (values) => ({
  email: validateEmail(values.email),
  password: validatePassword(values.password),
})

function LoginModal({ isOpen }) {
  const { login, closeAuthModal, openRegister } = useAuth()
  const form = useForm({ email: '', password: '' }, validate)
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.isValid || isSubmitting) {
      form.touchAll()
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    try {
      await login({ email: form.values.email.trim(), password: form.values.password })
    } catch (error) {
      if (error.errors) {
        form.applyServerErrors(error.errors)
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
      title="Log in"
      subtitle="Welcome back to Kino XII"
      className={styles.login}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          <Input
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            autoComplete="email"
            autoFocus
            {...form.getFieldProps('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...form.getFieldProps('password')}
          />
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
            disabled={!form.isValid || isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </Button>
          <p className={styles.switch}>
            Don&apos;t have an account?
            <button type="button" className={styles.switchLink} onClick={openRegister}>
              Sign up
            </button>
          </p>
        </div>
      </form>
    </Modal>
  )
}

export default LoginModal
