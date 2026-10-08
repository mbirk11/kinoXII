import { useId } from 'react'
import checkIcon from '../../assets/icons/check.svg'
import warningIcon from '../../assets/icons/warning-circle.svg'
import styles from './Input.module.css'

function Input({ label, error, isValid, className = '', ...props }) {
  const id = useId()
  const errorId = `${id}-error`
  const stateClass = error ? styles.error : ''

  return (
    <div className={`${styles.field} ${stateClass} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.control}>
        <input
          id={id}
          className={styles.input}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <span className={styles.icon}>
            <img src={warningIcon} alt="" width="12" height="12" />
          </span>
        )}
        {!error && isValid && (
          <span className={styles.icon}>
            <img src={checkIcon} alt="" width="16" height="16" />
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className={styles.helper}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
