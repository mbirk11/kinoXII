import TicketIcon from '../icons/TicketIcon'
import Skeleton from '../Skeleton/Skeleton'
import { formatPrice } from '../../utils/format'
import styles from './SessionCard.module.css'

const LOW_SEATS = 5

function SessionCard({ session, onSelect, disabled = false }) {
  const isDisabled = session.isSoldOut || disabled
  const isLow = session.seatsLeft <= LOW_SEATS

  return (
    <button
      type="button"
      className={`${styles.card} ${isDisabled ? styles.disabled : ''}`}
      onClick={() => onSelect(session)}
      disabled={isDisabled}
      aria-label={`${session.time}, ${session.venue.name} hall ${session.hall.name}, ${session.format.name}`}
    >
      <span className={styles.top}>
        <span className={styles.time}>{session.time}</span>
        <span className={styles.format}>{session.format.name}</span>
      </span>
      <span className={styles.middle}>
        <span className={styles.language}>{session.language.name}</span>
        {session.isSoldOut ? (
          <span className={styles.soldOut}>Sold out</span>
        ) : (
          <span className={`${styles.seats} ${isLow ? styles.low : ''}`}>
            <TicketIcon size={14} />
            {session.seatsLeft} left
          </span>
        )}
      </span>
      <span className={styles.bottom}>
        <span className={styles.venue}>
          {session.venue.name} · Hall {session.hall.name}
        </span>
        <span className={styles.price}>{formatPrice(session.price).replace(' ', '')}</span>
      </span>
    </button>
  )
}

export function SessionCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <span className={styles.top}>
        <Skeleton width={60} height={22} />
        <Skeleton width={70} height={24} radius={999} />
      </span>
      <span className={styles.middle}>
        <Skeleton width={110} height={14} />
        <Skeleton width={50} height={14} />
      </span>
      <span className={styles.bottom}>
        <Skeleton width={130} height={14} />
        <Skeleton width={36} height={18} />
      </span>
    </div>
  )
}

export default SessionCard
