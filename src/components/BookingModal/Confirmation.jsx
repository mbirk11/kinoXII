import { Link } from 'react-router-dom'
import Button from '../Button/Button'
import { formatPrice, formatShortDayMonth, getDayParts } from '../../utils/format'
import { summarizeTicketTypes } from '../../utils/booking'
import styles from './BookingModal.module.css'

// Rendered from the order the API returned, so it shows what was actually stored
function Confirmation({ order, movie, onClose }) {
  const { session } = order
  const { weekday } = getDayParts(session.date)

  return (
    <div className={styles.confirmation}>
      <span className={styles.successIcon} aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5 10 17l9-10" />
        </svg>
      </span>
      <h2 className={styles.confirmationTitle}>Booking confirmed!</h2>
      <p className={styles.confirmationText}>
        Your tickets are ready. We&apos;ve sent the confirmation to {order.contact?.email ?? 'your email'}.
      </p>
      <span className={styles.orderReference}>Order #{order.reference}</span>

      <div className={styles.orderCard}>
        <div className={styles.orderMovie}>
          <img className={styles.orderPoster} src={movie.posterUrl} alt="" />
          <div>
            <p className={styles.summaryTitle}>{movie.title}</p>
            <p className={styles.summaryMeta}>
              {session.venue.name} · Hall {session.hall.name} · {weekday} {formatShortDayMonth(session.date)} ·{' '}
              {session.time}
            </p>
          </div>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryRow}>
          <span>Seats</span>
          <strong>{order.tickets.map((ticket) => ticket.seatCode).join(', ')}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Tickets</span>
          <strong>{summarizeTicketTypes(order.tickets, (ticket) => ticket.ticketType.name)}</strong>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryRow}>
          <span className={styles.subtotalLabel}>Total paid</span>
          <strong className={styles.totalPaid}>{formatPrice(order.totalPrice)}</strong>
        </div>
      </div>

      <div className={styles.confirmationActions}>
        <Button to="/profile?tab=tickets">View my tickets</Button>
        <Button variant="transparent" onClick={onClose}>
          Close
        </Button>
      </div>
      <Link to="/" className={styles.homeLink}>
        Back to home
      </Link>
    </div>
  )
}

export default Confirmation
