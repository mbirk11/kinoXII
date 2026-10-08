import { Link } from 'react-router-dom'
import Badge from '../Badge/Badge'
import Skeleton from '../Skeleton/Skeleton'
import { formatMovieMeta, formatPrice } from '../../utils/format'
import styles from './MovieCard.module.css'

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.slug}`} className={styles.card}>
      <img className={styles.poster} src={movie.posterUrl} alt={movie.title} loading="lazy" />
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.meta}>{formatMovieMeta(movie)}</p>
        <Badge>{movie.ageRating.code}</Badge>
      </div>
      <div className={styles.footer}>
        <p className={styles.price}>From {formatPrice(movie.fromPrice)}</p>
        <span className={styles.buy}>Buy Ticket</span>
      </div>
    </Link>
  )
}

export function MovieCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton height={300} radius={14} />
      <div className={styles.info}>
        <Skeleton width="70%" height={20} />
        <Skeleton width="45%" height={14} />
        <Skeleton width={36} height={22} radius={999} />
      </div>
      <div className={styles.footer}>
        <Skeleton width={60} height={14} />
        <Skeleton width={110} height={36} radius={999} />
      </div>
    </div>
  )
}

export default MovieCard
