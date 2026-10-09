import { useState } from 'react'
import Button from '../../components/Button/Button'
import ErrorState from '../../components/ErrorState/ErrorState'
import Modal from '../../components/Modal/Modal'
import Skeleton from '../../components/Skeleton/Skeleton'
import useAsync from '../../hooks/useAsync'
import { getTickets, refundOrder } from '../../api/profile'
import { formatPrice } from '../../utils/format'
import TicketCard from './TicketCard'
import styles from './ProfilePage.module.css'

const loadTickets = async () => {
  const [upcoming, past] = await Promise.all([getTickets('upcoming'), getTickets('past')])
  return { upcoming, past }
}

function RefundDialog({ order, onCancel, onConfirm }) {
  const [isRefunding, setIsRefunding] = useState(false)
  const [error, setError] = useState(null)

  const confirm = async () => {
    setIsRefunding(true)
    setError(null)
    try {
      await onConfirm(order)
    } catch (requestError) {
      setError(requestError.message)
      setIsRefunding(false)
    }
  }

  return (
    <Modal
      isOpen
      onClose={isRefunding ? () => {} : onCancel}
      title="Refund this order?"
      subtitle={`Order #${order.reference}`}
      className={styles.refundDialog}
    >
      <p className={styles.refundText}>
        {formatPrice(order.totalPrice)} will be returned to the card ending in {order.cardLastFour} and
        seats {order.tickets.map((ticket) => ticket.seatCode).join(', ')} will be released. This cannot be
        undone.
      </p>
      {error && (
        <p className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
      <div className={styles.refundActions}>
        <Button variant="transparent" onClick={onCancel} disabled={isRefunding}>
          Keep tickets
        </Button>
        <Button onClick={confirm} disabled={isRefunding}>
          {isRefunding ? 'Refunding...' : 'Refund order'}
        </Button>
      </div>
    </Modal>
  )
}

function MyTickets({ onCountChange }) {
  const [view, setView] = useState('upcoming')
  const [refunding, setRefunding] = useState(null)
  const [notice, setNotice] = useState(null)
  const { data, isLoading, error, retry } = useAsync(loadTickets)

  const orders = data?.[view] ?? []

  // Show what the server stored: reload both lists after a refund
  const handleRefund = async (order) => {
    const updated = await refundOrder(order.reference)
    setRefunding(null)
    setNotice(`Order #${updated.reference} was refunded. ${formatPrice(updated.totalPrice)} is on its way back.`)
    retry()
    onCountChange?.()
  }

  return (
    <div className={styles.tickets}>
      <div className={styles.segmented} role="tablist" aria-label="Ticket lists">
        {['upcoming', 'past'].map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={view === key}
            className={`${styles.segment} ${view === key ? styles.segmentActive : ''}`}
            onClick={() => setView(key)}
          >
            {key === 'upcoming' ? 'Upcoming' : 'Past'}
            <span className={styles.segmentCount}>{data ? data[key].length : '–'}</span>
          </button>
        ))}
      </div>

      {notice && (
        <p className={styles.saved} role="status">
          {notice}
        </p>
      )}

      {isLoading && (
        <div className={styles.ticketList}>
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} height={183} radius={24} />
          ))}
        </div>
      )}

      {error && <ErrorState message="We could not load your tickets." onRetry={retry} />}

      {!isLoading && !error && orders.length === 0 && (
        <div className={styles.emptyTickets}>
          <p className={styles.emptyTitle}>
            {view === 'upcoming' ? 'No upcoming tickets' : 'No past tickets yet'}
          </p>
          <p className={styles.emptyText}>
            {view === 'upcoming'
              ? 'When you book a session, your tickets will show up here.'
              : 'Sessions you have attended or refunded will appear here.'}
          </p>
          {view === 'upcoming' && <Button to="/sessions">Browse sessions</Button>}
        </div>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className={styles.ticketList}>
          {orders.map((order) => (
            <TicketCard
              key={order.id}
              order={order}
              onRefund={view === 'upcoming' ? setRefunding : undefined}
            />
          ))}
        </div>
      )}

      {refunding && (
        <RefundDialog order={refunding} onCancel={() => setRefunding(null)} onConfirm={handleRefund} />
      )}
    </div>
  )
}

export default MyTickets
