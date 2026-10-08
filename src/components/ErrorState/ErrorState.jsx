import Button from '../Button/Button'
import styles from './ErrorState.module.css'

function ErrorState({ message = 'Something went wrong while loading.', onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="transparent" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export default ErrorState
