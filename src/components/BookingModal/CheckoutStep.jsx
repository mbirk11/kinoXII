import { useState } from 'react'
import Button from '../Button/Button'
import Input from '../Input/Input'
import useForm from '../../hooks/useForm'
import { formatPrice, formatShortDayMonth, getDayParts } from '../../utils/format'
import { summarizeTicketTypes } from '../../utils/booking'
import {
  validateCardNumber,
  validateCvv,
  validateEmail,
  validateExpiry,
  validateFullName,
  validateMobileNumber,
} from '../../utils/validation'
import styles from './BookingModal.module.css'

const validate = (values) => ({
  fullName: validateFullName(values.fullName),
  email: validateEmail(values.email),
  mobileNumber: validateMobileNumber(values.mobileNumber),
  cardNumber: validateCardNumber(values.cardNumber),
  expiry: validateExpiry(values.expiry),
  cvv: validateCvv(values.cvv),
})

// "4242424242424242" -> "4242 4242 4242 4242"
const formatCardNumber = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

// "1230" -> "12/30"
const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function CheckoutStep({ session, movie, hold, user, onBack, onSubmit }) {
  const form = useForm(
    {
      fullName: user.fullName ?? '',
      email: user.email ?? '',
      mobileNumber: user.mobileNumber ?? '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
    validate,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)

  const fieldProps = (name, format) => {
    const props = form.getFieldProps(name)
    return format
      ? { ...props, onChange: (event) => form.setValue(name, format(event.target.value)) }
      : props
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.isValid || isSubmitting) {
      form.touchAll()
      return
    }

    setIsSubmitting(true)
    setFormError(null)
    try {
      await onSubmit({
        fullName: form.values.fullName.trim(),
        email: form.values.email.trim(),
        mobileNumber: form.values.mobileNumber.replace(/\s/g, ''),
        cardNumber: form.values.cardNumber.replace(/\s/g, ''),
        expiry: form.values.expiry,
        cvv: form.values.cvv,
      })
    } catch (error) {
      if (error.status === 422 && error.errors) {
        form.applyServerErrors(error.errors)
      } else if (error.handled !== true) {
        setFormError(error.message)
      }
      setIsSubmitting(false)
    }
  }

  const { weekday } = getDayParts(session.date)

  return (
    <form className={styles.body} onSubmit={handleSubmit} noValidate>
      <div className={styles.main}>
        <div className={styles.checkoutFields}>
          <Input label="Full name" placeholder="e.g. Nino Beridze" autoComplete="name" {...fieldProps('fullName')} />
          <div className={styles.fieldRow}>
            <Input label="Email" type="email" placeholder="e.g. nino@gmail.com" autoComplete="email" {...fieldProps('email')} />
            <Input
              label="Mobile number"
              inputMode="numeric"
              placeholder="e.g. 555 123 456"
              autoComplete="tel"
              {...fieldProps('mobileNumber')}
            />
          </div>
          <div className={styles.checkoutDivider} />
          <Input
            label="Card number"
            inputMode="numeric"
            placeholder="e.g. 1234 4567 8901 2345"
            autoComplete="cc-number"
            {...fieldProps('cardNumber', formatCardNumber)}
          />
          <div className={styles.fieldRow}>
            <Input
              label="Expiry"
              inputMode="numeric"
              placeholder="e.g. 12/34"
              autoComplete="cc-exp"
              {...fieldProps('expiry', formatExpiry)}
            />
            <Input
              label="CVV"
              inputMode="numeric"
              placeholder="e.g. 123"
              autoComplete="cc-csc"
              {...fieldProps('cvv', (value) => value.replace(/\D/g, '').slice(0, 3))}
            />
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.panelBody}>
          <h3 className={styles.panelTitle}>Summary</h3>
          <div className={styles.summaryCard}>
            <p className={styles.summaryTitle}>{movie.title}</p>
            <p className={styles.summaryMeta}>
              Hall {session.hall.name} · {weekday} {formatShortDayMonth(session.date)} · {session.time}
            </p>
            <div className={styles.summaryDivider} />
            <div className={styles.summaryRow}>
              <span>Seats</span>
              <strong>{hold.seats.map((seat) => seat.code).join(', ')}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Tickets</span>
              <strong>{summarizeTicketTypes(hold.seats, (seat) => seat.ticketType.name)}</strong>
            </div>
          </div>
          {formError && (
            <p className={styles.violations} role="alert">
              {formError}
            </p>
          )}
        </div>

        <div className={styles.panelFooter}>
          <button type="button" className={styles.backButton} onClick={onBack} disabled={isSubmitting}>
            ← Back to seats
          </button>
          <div className={styles.subtotal}>
            <span className={styles.subtotalLabel}>Subtotal</span>
            <span className={styles.subtotalValue}>{formatPrice(hold.subtotal)}</span>
          </div>
          <Button type="submit" className={styles.fullWidth} disabled={!form.isValid || isSubmitting}>
            {isSubmitting ? 'Processing payment...' : 'Pay: Complete order'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CheckoutStep
