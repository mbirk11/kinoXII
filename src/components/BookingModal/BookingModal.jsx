import { useCallback, useMemo, useState } from 'react'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import ErrorState from '../ErrorState/ErrorState'
import Skeleton from '../Skeleton/Skeleton'
import useAsync from '../../hooks/useAsync'
import useAuth from '../../hooks/useAuth'
import { getFilterOptions } from '../../api/sessions'
import { createOrder, getSeatMap, getSession, holdSeats, releaseHold } from '../../api/booking'
import { getAgeBlockMessage } from '../../utils/ageGate'
import { isTicketTypeBlocked } from '../../utils/booking'
import { formatDayMonth, getDayParts } from '../../utils/format'
import CheckoutStep from './CheckoutStep'
import Confirmation from './Confirmation'
import HoldTimer from './HoldTimer'
import SeatMap from './SeatMap'
import SeatSelectionPanel from './SeatSelectionPanel'
import styles from './BookingModal.module.css'

const EXPIRED_MESSAGE = 'Your hold time expired. Please re-select your seats.'

const loadBooking = async (sessionId) => {
  const [session, options] = await Promise.all([getSession(sessionId), getFilterOptions()])
  return { session, options }
}

function StepIndicator({ step, onGoToSeats }) {
  return (
    <div className={styles.steps} aria-label="Booking steps">
      <button
        type="button"
        className={`${styles.step} ${step === 'seats' ? styles.stepActive : ''}`}
        onClick={onGoToSeats}
        disabled={step !== 'checkout'}
        aria-current={step === 'seats' ? 'step' : undefined}
      >
        1. Seats
      </button>
      <span
        className={`${styles.step} ${step === 'checkout' ? styles.stepActive : ''}`}
        aria-current={step === 'checkout' ? 'step' : undefined}
      >
        2. Checkout
      </span>
    </div>
  )
}

function BookingModal({ sessionId, onClose }) {
  const { user } = useAuth()
  const booking = useAsync(() => loadBooking(sessionId), [sessionId])
  const [mapVersion, setMapVersion] = useState(0)
  const seatMapState = useAsync(() => getSeatMap(sessionId), [sessionId, mapVersion])

  const [step, setStep] = useState('seats')
  const [selection, setSelection] = useState([])
  const [hold, setHold] = useState(null)
  const [order, setOrder] = useState(null)
  const [notice, setNotice] = useState(null)
  const [isHolding, setIsHolding] = useState(false)
  // Seats lost to someone else stay marked sold until the refreshed map arrives
  const [takenCodes, setTakenCodes] = useState(() => new Set())

  const session = booking.data?.session
  const options = booking.data?.options
  const movie = session?.movie

  const refetchMap = () => setMapVersion((version) => version + 1)

  const seatMap = useMemo(() => {
    if (!seatMapState.data) return null
    return {
      ...seatMapState.data,
      sections: seatMapState.data.sections.map((section) => ({
        ...section,
        rows: section.rows.map((row) => ({
          ...row,
          seats: row.seats.map((seat) =>
            takenCodes.has(seat.code) && seat.state === 'available' ? { ...seat, state: 'sold' } : seat,
          ),
        })),
      })),
    }
  }, [seatMapState.data, takenCodes])

  const selectedIds = useMemo(() => new Set(selection.map((item) => item.seat.id)), [selection])
  const maxSeats = options?.maxSeatsPerOrder ?? 3
  const ticketTypes = useMemo(
    () => [...(options?.ticketTypes ?? [])].sort((a, b) => a.priceRatio - b.priceRatio),
    [options],
  )

  const violations = movie
    ? selection
        .filter(({ ticketType }) => {
          const type = ticketTypes.find((item) => item.slug === ticketType)
          return type && isTicketTypeBlocked(type, movie)
        })
        .map(
          ({ seat, ticketType }) =>
            `Seat ${seat.code}: ${ticketTypes.find((type) => type.slug === ticketType).name} tickets are not available for ${movie.ageRating.code} films.`,
        )
    : []

  const toggleSeat = (seat) => {
    setNotice(null)
    if (selectedIds.has(seat.id)) {
      setSelection((items) => items.filter((item) => item.seat.id !== seat.id))
      return
    }
    if (selection.length >= maxSeats) {
      setNotice(`You can choose up to ${maxSeats} seats per order.`)
      return
    }
    setSelection((items) => [...items, { seat, ticketType: 'adult' }])
  }

  const changeType = (seatId, ticketType) =>
    setSelection((items) => items.map((item) => (item.seat.id === seatId ? { ...item, ticketType } : item)))

  const removeSeat = (seatId) => setSelection((items) => items.filter((item) => item.seat.id !== seatId))

  // Someone else took seats: name them, keep the rest of the selection, redraw the map
  const handleConflict = (contested) => {
    const lost = new Set(contested)
    setTakenCodes((current) => new Set([...current, ...lost]))
    setSelection((items) => items.filter((item) => !lost.has(item.seat.code)))
    setHold(null)
    setStep('seats')
    setNotice(
      contested.length
        ? `Sorry, ${contested.length === 1 ? 'seat' : 'seats'} ${contested.join(', ')} ${contested.length === 1 ? 'was' : 'were'} just taken by someone else. Your other seats are still selected.`
        : 'Some of those seats were just taken. Please check your selection.',
    )
    refetchMap()
  }

  const handleExpire = useCallback(() => {
    setHold(null)
    setSelection([])
    setStep('seats')
    setNotice(EXPIRED_MESSAGE)
    setMapVersion((version) => version + 1)
  }, [])

  const goToCheckout = async () => {
    if (isHolding || selection.length === 0 || violations.length > 0) return
    setIsHolding(true)
    setNotice(null)
    try {
      const newHold = await holdSeats(
        sessionId,
        selection.map(({ seat, ticketType }) => ({ seatId: seat.id, ticketType })),
      )
      setHold(newHold)
      setStep('checkout')
    } catch (error) {
      if (error.status === 409) {
        handleConflict(error.contested)
      } else if (error.status !== 401) {
        const fieldMessage = error.errors && Object.values(error.errors)[0]?.[0]
        setNotice(fieldMessage ?? error.message)
      }
    } finally {
      setIsHolding(false)
    }
  }

  const pay = async (payload) => {
    try {
      const paidOrder = await createOrder({ holdId: hold.holdId, ...payload })
      setOrder(paidOrder)
      setHold(null)
      setStep('done')
    } catch (error) {
      if (error.status === 422 && !error.errors) {
        handleExpire()
        error.handled = true
      } else if (error.status === 409) {
        handleConflict(error.contested)
        error.handled = true
      }
      throw error
    }
  }

  // Closing without paying gives the held seats straight back
  const handleClose = () => {
    if (hold && step !== 'done') releaseHold(hold.holdId).catch(() => {})
    onClose()
  }

  const subtitle = session
    ? [
        session.venue.name,
        `Hall ${session.hall.name}`,
        `${getDayParts(session.date).weekday} ${formatDayMonth(session.date)}`,
        session.time,
        session.format.name,
        session.language.name,
      ].join(' · ')
    : undefined

  const renderContent = () => {
    if (booking.isLoading) {
      return (
        <div className={styles.loading} aria-busy="true">
          <Skeleton height={32} radius={999} />
          <Skeleton height={360} radius={20} />
        </div>
      )
    }
    if (booking.error || !movie) {
      return <ErrorState message="We could not load this session." onRetry={booking.retry} />
    }
    if (order) {
      return <Confirmation order={order} movie={movie} onClose={onClose} />
    }
    if (!user.profileComplete) {
      return (
        <div className={styles.gate}>
          <p className={styles.gateTitle}>Complete your profile to book</p>
          <p className={styles.gateText}>
            We need your full name, mobile number and date of birth before you can buy tickets.
          </p>
          <Button to="/profile">Complete profile</Button>
        </div>
      )
    }
    const ageMessage = getAgeBlockMessage(movie, user)
    if (ageMessage) {
      return (
        <div className={styles.gate}>
          <p className={styles.gateTitle}>Age restricted</p>
          <p className={styles.gateText}>{ageMessage}</p>
        </div>
      )
    }

    return (
      <>
        <StepIndicator step={step} onGoToSeats={() => setStep('seats')} />
        {notice && (
          <p className={styles.notice} role="alert">
            {notice}
          </p>
        )}
        {step === 'checkout' && hold ? (
          <CheckoutStep
            session={session}
            movie={movie}
            hold={hold}
            user={user}
            onBack={() => setStep('seats')}
            onSubmit={pay}
          />
        ) : (
          <div className={styles.body}>
            <div className={styles.main}>
              {seatMapState.error && (
                <ErrorState message="We could not load the hall map." onRetry={seatMapState.retry} />
              )}
              {!seatMap && !seatMapState.error && <Skeleton height={420} radius={20} />}
              {seatMap && (
                <SeatMap seatMap={seatMap} selectedIds={selectedIds} onToggleSeat={toggleSeat} />
              )}
            </div>
            <SeatSelectionPanel
              session={session}
              movie={movie}
              ticketTypes={ticketTypes}
              maxSeats={maxSeats}
              selection={selection}
              violations={violations}
              onChangeType={changeType}
              onRemove={removeSeat}
              onNext={goToCheckout}
              isHolding={isHolding}
              canContinue={selection.length > 0 && violations.length === 0}
            />
          </div>
        )}
      </>
    )
  }

  return (
    <Modal
      isOpen
      onClose={handleClose}
      title={order ? undefined : movie?.title ?? 'Book tickets'}
      ariaLabel="Booking confirmed"
      subtitle={order ? undefined : subtitle}
      headerExtra={hold && step !== 'done' ? <HoldTimer expiresAt={hold.expiresAt} onExpire={handleExpire} /> : null}
      className={styles.modal}
    >
      {renderContent()}
    </Modal>
  )
}

export default BookingModal
