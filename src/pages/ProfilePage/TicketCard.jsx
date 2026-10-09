import { Link } from 'react-router-dom'
import Badge from '../../components/Badge/Badge'
import { formatPrice, formatShortDayMonth, getDayParts } from '../../utils/format'
import styles from './ProfilePage.module.css'

const REFUND_CUTOFF_HOURS = 2

// "14:30, Tue 15 Sep" in the same clock the API uses for session times
function formatRefundDeadline(startsAt) {
  const deadline = new Date(new Date(startsAt).getTime() - REFUND_CUTOFF_HOURS * 3_600_000)
  const options = { timeZone: 'UTC' }
  const time = deadline.toLocaleTimeString('en-GB', { ...options, hour: '2-digit', minute: '2-digit' })
  const weekday = deadline.toLocaleDateString('en-GB', { ...options, weekday: 'short' })
  const day = deadline.toLocaleDateString('en-GB', { ...options, day: 'numeric', month: 'short' })
  return `${time}, ${weekday} ${day}`
}

function TicketCard({ order, onRefund }) {
  const { session } = order
  const { movie } = session
  const { weekday } = getDayParts(session.date)
  const isRefunded = order.status === 'refunded'

  return (
    <article className={styles.ticketCard}>
      <div className={styles.ticketMain}>
        <Link to={`/movies/${movie.slug}`} className={styles.ticketPosterLink} tabIndex={-1}>
          <img className={styles.ticketPoster} src={movie.posterUrl} alt="" loading="lazy" />
        </Link>
        <div className={styles.ticketInfo}>
          <div className={styles.ticketTitleRow}>
            <Link to={`/movies/${movie.slug}`} className={styles.ticketTitle}>
              {movie.title}
            </Link>
            <Badge className={styles.ticketBadge}>{movie.ageRating.code}</Badge>
            <span className={styles.ticketRuntime}>{movie.runtimeMinutes} min</span>
          </div>
          <dl className={styles.ticketFacts}>
            <div>
              <dt>Date</dt>
              <dd>
                {weekday} {formatShortDayMonth(session.date)} · {session.time}
              </dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>
                {session.venue.name} · Hall {session.hall.name}
              </dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>
                {session.format.name} · {session.language.name}
              </dd>
            </div>
          </dl>
          <div className={styles.ticketSeats}>
            <span className={styles.ticketSeatsLabel}>Seats</span>
            {order.tickets.map((ticket) => (
              <span key={ticket.id} className={styles.seatChip}>
                {ticket.seatCode} · {ticket.ticketType.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ticketStub}>
        <div>
          <p className={styles.stubLabel}>Order</p>
          <p className={styles.stubReference}>#{order.reference}</p>
        </div>
        <div className={styles.stubTotal}>
          <span>{isRefunded ? 'Refunded' : 'Total paid'}</span>
          <strong className={isRefunded ? styles.refundedAmount : undefined}>
            {formatPrice(order.totalPrice).replace(' ', '')}
          </strong>
        </div>
        {onRefund && (
          <>
            <button
              type="button"
              className={styles.refundButton}
              onClick={() => onRefund(order)}
              disabled={!order.isRefundable}
              title={order.isRefundable ? undefined : 'Refunds close 2 hours before the session starts'}
            >
              Refund
            </button>
            <p className={styles.stubNote}>
              {order.isRefundable
                ? `Refundable until ${formatRefundDeadline(session.startsAt)}`
                : 'Refunds close 2 hours before the session starts'}
            </p>
          </>
        )}
        {!onRefund && (
          <p className={styles.stubNote}>
            {isRefunded ? 'This order was refunded' : 'Session has ended'}
          </p>
        )}
      </div>
    </article>
  )
}

export default TicketCard
