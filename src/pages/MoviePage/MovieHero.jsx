import Badge from '../../components/Badge/Badge'
import timerIcon from '../../assets/icons/timer.svg'
import styles from './MoviePage.module.css'

function MovieHero({ movie }) {
  return (
    <section className={styles.hero}>
      <img className={styles.heroBackdrop} src={movie.backdropUrl || movie.posterUrl} alt="" />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <img className={styles.poster} src={movie.posterUrl} alt={`${movie.title} poster`} />
        <div className={styles.heroInfo}>
          <span className={styles.statusLabel}>
            {movie.isComingSoon ? 'Coming soon' : 'Now playing'}
          </span>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.synopsis}>{movie.synopsis}</p>
          <div className={styles.badges}>
            <span title={movie.ageRating.description}>
              <Badge size="medium">{movie.ageRating.code}</Badge>
            </span>
            <Badge size="medium" variant="white" icon={timerIcon}>
              {movie.runtimeMinutes} Min
            </Badge>
            {movie.formats.map((format) => (
              <Badge key={format.id} size="medium" variant="white">
                {format.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MovieHero
