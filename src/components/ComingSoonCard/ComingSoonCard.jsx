import { Link } from 'react-router-dom'
import Badge from '../Badge/Badge'
import Skeleton from '../Skeleton/Skeleton'
import NotifyButton from './NotifyButton'
import { formatDayMonth, formatMovieMeta } from '../../utils/format'
import styles from './ComingSoonCard.module.css'

function ComingSoonCard({ movie }) {
  const imageUrl = movie.backdropUrl || movie.posterUrl

  return (
    <article className={styles.card}>
      <Link to={`/movies/${movie.slug}`} className={styles.imageLink} tabIndex={-1}>
        <img className={styles.image} src={imageUrl} alt="" loading="lazy" />
      </Link>
      <div className={styles.content}>
        <div className={styles.info}>
          <p className={styles.release}>In cinemas {formatDayMonth(movie.releaseDate)}</p>
          <Link to={`/movies/${movie.slug}`} className={styles.title}>
            {movie.title}
          </Link>
          <p className={styles.meta}>{formatMovieMeta(movie)}</p>
          <Badge>{movie.ageRating.code}</Badge>
        </div>
        <NotifyButton movie={movie} />
      </div>
    </article>
  )
}

export function ComingSoonCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton width={200} height="100%" radius={14} />
      <div className={styles.content}>
        <div className={styles.info}>
          <Skeleton width={140} height={14} />
          <Skeleton width={160} height={14} />
          <Skeleton width={100} height={14} />
          <Skeleton width={36} height={22} radius={999} />
        </div>
        <Skeleton width={96} height={28} radius={999} />
      </div>
    </div>
  )
}

export default ComingSoonCard
