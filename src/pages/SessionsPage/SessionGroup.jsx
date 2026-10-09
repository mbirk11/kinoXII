import { Link } from 'react-router-dom'
import Badge from '../../components/Badge/Badge'
import HorizontalRow from '../../components/HorizontalRow/HorizontalRow'
import SessionCard, { SessionCardSkeleton } from '../../components/SessionCard/SessionCard'
import Skeleton from '../../components/Skeleton/Skeleton'
import styles from './SessionsPage.module.css'

function SessionGroup({ movie, sessions, onSelectSession }) {
  return (
    <article className={styles.movieGroup}>
      <header className={styles.movieHeader}>
        <Link to={`/movies/${movie.slug}`} className={styles.posterLink} tabIndex={-1}>
          <img className={styles.poster} src={movie.posterUrl} alt="" loading="lazy" />
        </Link>
        <div className={styles.movieInfo}>
          <div className={styles.movieTitleRow}>
            <Link to={`/movies/${movie.slug}`} className={styles.movieTitle}>
              {movie.title}
            </Link>
            <Badge className={styles.ageBadge}>{movie.ageRating.code}</Badge>
          </div>
          <p className={styles.runtime}>{movie.runtimeMinutes} min</p>
        </div>
      </header>
      <HorizontalRow gap={12}>
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} onSelect={onSelectSession} />
        ))}
      </HorizontalRow>
    </article>
  )
}

export function SessionGroupSkeleton() {
  return (
    <div className={styles.movieGroup} aria-hidden="true">
      <div className={styles.movieHeader}>
        <Skeleton width={56} height={80} radius={6} />
        <div className={styles.movieInfo}>
          <Skeleton width={200} height={20} />
          <Skeleton width={60} height={14} />
        </div>
      </div>
      <div className={styles.skeletonRow}>
        {Array.from({ length: 4 }, (_, index) => (
          <SessionCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export default SessionGroup
