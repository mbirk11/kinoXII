import { useState } from 'react'
import DateSelector from '../../components/DateSelector/DateSelector'
import ErrorState from '../../components/ErrorState/ErrorState'
import NotifyButton from '../../components/ComingSoonCard/NotifyButton'
import Skeleton from '../../components/Skeleton/Skeleton'
import TicketSessionCard from '../../components/TicketSessionCard/TicketSessionCard'
import useAsync from '../../hooks/useAsync'
import { getMovieSessions } from '../../api/movies'
import { formatDayMonth, getDayParts, getUpcomingDates } from '../../utils/format'
import styles from './MoviePage.module.css'

function groupByHall(sessions) {
  const halls = new Map()
  sessions.forEach((session) => {
    const key = session.hall.id
    if (!halls.has(key)) halls.set(key, { hall: session.hall, sessions: [] })
    halls.get(key).sessions.push(session)
  })
  return [...halls.values()]
}

function MovieSessions({ movie, ageBlockMessage, onSelectSession }) {
  const dates = getUpcomingDates(7)
  const available = new Set(movie.availableDates ?? [])
  const [date, setDate] = useState(() => dates.find((day) => available.has(day)) ?? dates[0])

  const { data: venues, isLoading, error, retry } = useAsync(
    () => getMovieSessions(movie.slug, date),
    [movie.slug, date],
  )

  if (movie.isComingSoon) {
    return (
      <section className={styles.sessions}>
        <h2 className={styles.sectionTitle}>Sessions</h2>
        <div className={styles.comingSoon}>
          <p className={styles.comingSoonTitle}>
            In cinemas {formatDayMonth(movie.releaseDate)}
          </p>
          <p className={styles.mutedText}>
            Tickets are not on sale yet. Get a reminder when sessions open.
          </p>
          <NotifyButton movie={movie} />
        </div>
      </section>
    )
  }

  const sessionCount = venues?.reduce((total, venue) => total + venue.sessions.length, 0) ?? 0
  const { weekday } = getDayParts(date)

  return (
    <section className={styles.sessions}>
      <div className={styles.sessionsHeader}>
        <h2 className={styles.sectionTitle}>Sessions</h2>
        <p className={styles.mutedText}>
          {isLoading
            ? 'Loading sessions...'
            : `${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'} on ${weekday}, ${formatDayMonth(date)}`}
        </p>
      </div>

      <DateSelector
        dates={dates}
        value={date}
        onChange={setDate}
        size="large"
        isDisabled={(day) => !available.has(day)}
      />

      {ageBlockMessage && (
        <p className={styles.ageNotice} role="alert">
          {ageBlockMessage}
        </p>
      )}

      {isLoading && (
        <div className={styles.venue}>
          <Skeleton width={140} height={16} />
          <div className={styles.halls}>
            <Skeleton width={454} height={132} radius={20} />
            <Skeleton width={454} height={132} radius={20} />
          </div>
        </div>
      )}

      {error && <ErrorState message="We could not load the sessions for this day." onRetry={retry} />}

      {!isLoading && !error && sessionCount === 0 && (
        <div className={styles.noSessions}>
          <p className={styles.comingSoonTitle}>No sessions on this day</p>
          <p className={styles.mutedText}>Pick another date to see showtimes.</p>
        </div>
      )}

      {!isLoading &&
        !error &&
        venues?.map(({ venue, sessions }) => (
          <div key={venue.id} className={styles.venue}>
            <h3 className={styles.venueName}>{venue.name}</h3>
            <div className={styles.halls}>
              {groupByHall(sessions).map(({ hall, sessions: hallSessions }) => (
                <div key={hall.id} className={styles.hall}>
                  <p className={styles.hallName}>Hall {hall.name}</p>
                  <div className={styles.tickets}>
                    {hallSessions.map((session) => (
                      <TicketSessionCard
                        key={session.id}
                        session={session}
                        onSelect={onSelectSession}
                        disabled={Boolean(ageBlockMessage)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </section>
  )
}

export default MovieSessions
