import { Link } from 'react-router-dom'
import Badge from '../Badge/Badge'
import { formatMovieMeta } from '../../utils/format'
import styles from './CompactMovieCard.module.css'

function CompactMovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.slug}`} className={styles.card}>
      <img
        className={styles.image}
        src={movie.backdropUrl || movie.posterUrl}
        alt=""
        loading="lazy"
      />
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.meta}>{formatMovieMeta(movie)}</p>
        <Badge className={styles.badge}>{movie.ageRating.code}</Badge>
      </div>
    </Link>
  )
}

export default CompactMovieCard
