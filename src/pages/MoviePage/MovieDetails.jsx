import { formatDayMonth, formatPrice } from '../../utils/format'
import styles from './MoviePage.module.css'

function DetailItem({ label, children }) {
  return (
    <div className={styles.detail}>
      <dt className={styles.detailLabel}>{label}</dt>
      <dd className={styles.detailValue}>{children}</dd>
    </div>
  )
}

function MovieDetails({ movie }) {
  const releaseYear = new Date(movie.releaseDate).getFullYear()

  return (
    <aside className={styles.details}>
      <h2 className={styles.sectionTitle}>Details</h2>
      <dl className={styles.detailList}>
        {movie.director && <DetailItem label="Director">{movie.director}</DetailItem>}
        {movie.cast && <DetailItem label="Main cast">{movie.cast}</DetailItem>}
        <DetailItem label="Genre">{movie.genres.map((genre) => genre.name).join(', ')}</DetailItem>
        <DetailItem label="Duration">{movie.runtimeMinutes} minutes</DetailItem>
        <DetailItem label="Release date">
          {formatDayMonth(movie.releaseDate)} {releaseYear}
        </DetailItem>
        <DetailItem label="Formats">
          {movie.formats.map((format) => format.name).join(', ')}
        </DetailItem>
        {!movie.isComingSoon && (
          <DetailItem label="From">{formatPrice(movie.fromPrice).replace(' ', '')}</DetailItem>
        )}
      </dl>
      <div className={styles.ratingNote}>
        <p className={styles.ratingTitle}>Rating note</p>
        <p className={styles.ratingText}>
          <span className={styles.ratingCode}>{movie.ageRating.code}</span>
          {movie.ageRating.description}
        </p>
      </div>
    </aside>
  )
}

export default MovieDetails
