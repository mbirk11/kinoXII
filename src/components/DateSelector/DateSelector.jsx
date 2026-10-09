import { getDayParts } from '../../utils/format'
import styles from './DateSelector.module.css'

function DateSelector({ dates, value, onChange, size = 'small' }) {
  return (
    <div className={`${styles.row} ${styles[size]}`} role="radiogroup" aria-label="Date">
      {dates.map((date) => {
        const { weekday, day } = getDayParts(date)
        const isActive = date === value
        return (
          <button
            key={date}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`${styles.day} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(date)}
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
