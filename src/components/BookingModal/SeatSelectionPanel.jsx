import Button from '../Button/Button'
import { formatPrice } from '../../utils/format'
import { getSeatPrice, isTicketTypeBlocked } from '../../utils/booking'
import styles from './BookingModal.module.css'

function SeatSelectionPanel({
  session,
  movie,
  ticketTypes,
  maxSeats,
  selection,
  violations,
  onChangeType,
  onRemove,
  onNext,
  isHolding,
  canContinue,
}) {
  const subtotal = selection.reduce(
    (total, item) => total + getSeatPrice(session, ticketTypes, item.ticketType),
    0,
  )

  return (
    <div className={styles.panel}>
      <div className={styles.panelBody}>
        <h3 className={styles.panelTitle}>Your seats · Max {maxSeats}</h3>

        {selection.length === 0 && (
          <p className={styles.panelHint}>
            Pick up to {maxSeats} seats from the map. Each seat can carry its own ticket type.
          </p>
        )}

        <ul className={styles.seatCards}>
          {selection.map(({ seat, ticketType }) => (
            <li key={seat.id} className={styles.seatCard}>
              <div className={styles.seatCardHeader}>
                <span className={styles.seatCardLabel}>
                  Seat <strong>{seat.code}</strong>
                </span>
                <span className={styles.seatCardPrice}>
                  {formatPrice(getSeatPrice(session, ticketTypes, ticketType)).replace(' ', '')}
                </span>
                <button
                  type="button"
                  className={styles.seatRemove}
                  onClick={() => onRemove(seat.id)}
                  aria-label={`Remove seat ${seat.code}`}
                >
                  ×
                </button>
              </div>
              <div className={styles.ticketTypes} role="radiogroup" aria-label={`Ticket type for ${seat.code}`}>
                {ticketTypes.map((type) => {
                  const blocked = isTicketTypeBlocked(type, movie)
                  return (
                    <button
                      key={type.slug}
                      type="button"
                      role="radio"
                      aria-checked={ticketType === type.slug}
                      className={`${styles.ticketType} ${ticketType === type.slug ? styles.ticketTypeActive : ''}`}
                      onClick={() => onChangeType(seat.id, type.slug)}
                      disabled={blocked}
                      title={type.note ?? undefined}
                    >
                      {type.name} {Math.round(type.priceRatio * 100)}%
                    </button>
                  )
                })}
              </div>
            </li>
          ))}
        </ul>

        {violations.length > 0 && (
          <ul className={styles.violations} role="alert">
            {violations.map((violation) => (
              <li key={violation}>{violation}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.panelFooter}>
        <div className={styles.subtotal}>
          <span className={styles.subtotalLabel}>Subtotal</span>
          <span className={styles.subtotalValue}>{formatPrice(subtotal)}</span>
        </div>
        <Button
          className={styles.fullWidth}
          onClick={onNext}
          disabled={!canContinue || isHolding}
        >
          {isHolding ? 'Holding seats...' : 'Next: Checkout'}
        </Button>
      </div>
    </div>
  )
}

export default SeatSelectionPanel
