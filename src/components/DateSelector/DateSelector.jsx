import { getDayParts } from '../../utils/format'
import styles from './DateSelector.module.css'

function DateSelector({ dates, value, onChange, size = 'small', isDisabled }) {
  return (
    <div className={`${styles.row} ${styles[size]}`} role="radiogroup" aria-label="Date">
      {dates.map((date) => {
        const { weekday, day } = getDayParts(date)
        const isActive = date === value
        const disabled = isDisabled?.(date) ?? false
        return (
          <button
            key={date}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`${styles.day} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(date)}
            disabled={disabled}
          >
            <span>{weekday}</span>
            <span className={styles.number}>{day}</span>
          </button>
        )
      })}
    </div>
  )
}

export default DateSelector
