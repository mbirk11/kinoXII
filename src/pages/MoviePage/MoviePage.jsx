import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import BookingModal from '../../components/BookingModal/BookingModal'
import ErrorState from '../../components/ErrorState/ErrorState'
import Skeleton from '../../components/Skeleton/Skeleton'
import useAsync from '../../hooks/useAsync'
import useAuth from '../../hooks/useAuth'
import { getMovie } from '../../api/movies'
import { addRecentlyViewed } from '../../utils/recentlyViewed'
import { getAgeBlockMessage } from '../../utils/ageGate'
import MovieDetails from './MovieDetails'
import MovieHero from './MovieHero'
import MovieSessions from './MovieSessions'
import styles from './MoviePage.module.css'

function MoviePage() {
  const { movieId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isAuthLoading, requireAuth, openLogin } = useAuth()
  const bookingSessionId = searchParams.get('session')
  const { data: movie, isLoading, error, retry } = useAsync(() => getMovie(movieId), [movieId])

  useEffect(() => {
    if (movie) addRecentlyViewed(movie)
  }, [movie])

  // A booking link opened by a guest asks them to log in first
  useEffect(() => {
    if (bookingSessionId && !user && !isAuthLoading) openLogin()
  }, [bookingSessionId, user, isAuthLoading, openLogin])

  const closeBooking = () => setSearchParams({}, { replace: true })

  if (isLoading) {
    return (
      <div className={styles.loading} aria-busy="true">
        <Skeleton width="100%" height={567} radius={0} />
        <div className={styles.loadingBody}>
          <Skeleton width={160} height={24} />
          <Skeleton width={580} height={80} radius={16} />
        </div>
      </div>
    )
  }

  if (error?.status === 404) {
    return (
      <div className="page">
        <div className={styles.notFound}>
          <h1 className={styles.sectionTitle}>Film not found</h1>
          <p className={styles.mutedText}>This film may have been removed or the link is wrong.</p>
          <Link to="/sessions" className={styles.backLink}>
            Browse all sessions
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <ErrorState message="We could not load this film." onRetry={retry} />
      </div>
    )
  }

  // Opening ?session=ID starts the booking flow for that showtime
  const handleSelectSession = (session) =>
    requireAuth((signedInUser) => {
      if (getAgeBlockMessage(movie, signedInUser)) return
      setSearchParams({ session: String(session.id) })
    })

  return (
    <>
      <MovieHero movie={movie} />
      <div className={styles.body}>
        <MovieSessions
          movie={movie}
          ageBlockMessage={getAgeBlockMessage(movie, user)}
          onSelectSession={handleSelectSession}
        />
        <MovieDetails movie={movie} />
      </div>
      {bookingSessionId && user && (
        <BookingModal key={bookingSessionId} sessionId={bookingSessionId} onClose={closeBooking} />
      )}
    </>
  )
}

export default MoviePage
