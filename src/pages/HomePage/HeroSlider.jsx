import { useEffect, useState } from 'react'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'
import ErrorState from '../../components/ErrorState/ErrorState'
import Skeleton from '../../components/Skeleton/Skeleton'
import useAsync from '../../hooks/useAsync'
import { getFeaturedMovies } from '../../api/movies'
import { formatShortDayMonth } from '../../utils/format'
import arrowIcon from '../../assets/icons/arrow-left.svg'
import ticketIcon from '../../assets/icons/ticket.svg'
import timerIcon from '../../assets/icons/timer.svg'
import styles from './HeroSlider.module.css'

const PREMIERE_WINDOW_DAYS = 30
const SLIDE_DURATION_MS = 7000

function getHeroLabel(movie) {
  const daysSinceRelease = (Date.now() - new Date(movie.releaseDate)) / 86_400_000
  if (daysSinceRelease <= PREMIERE_WINDOW_DAYS) {
    return `Premiere · Week of ${formatShortDayMonth(movie.releaseDate)}`
  }
  return movie.genres.map((genre) => genre.name).join(' · ')
}

function HeroSlider() {
  const { data: movies, isLoading, error, retry } = useAsync(getFeaturedMovies)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideCount = movies?.length ?? 0

  // Auto-advance; restarts whenever the slide changes, paused while hovered
  useEffect(() => {
    if (slideCount < 2 || isPaused) return
    const timer = setTimeout(
      () => setActiveIndex((index) => (index + 1) % slideCount),
      SLIDE_DURATION_MS,
    )
    return () => clearTimeout(timer)
  }, [activeIndex, isPaused, slideCount])

  if (isLoading) {
    return (
      <section className={`${styles.hero} ${styles.placeholder}`} aria-busy="true">
        <div className={styles.content}>
          <Skeleton width={180} height={26} radius={999} />
          <Skeleton width={420} height={44} />
          <Skeleton width={300} height={26} radius={999} />
          <Skeleton width={560} height={54} />
          <Skeleton width={260} height={42} radius={999} />
        </div>
      </section>
    )
  }

  if (error || !movies?.length) {
    return (
      <section className={`${styles.hero} ${styles.placeholder}`}>
        <div className={styles.message}>
          <ErrorState
            message={error ? 'We could not load the featured films.' : 'No featured films right now.'}
            onRetry={error ? retry : undefined}
          />
        </div>
      </section>
    )
  }

  const movie = movies[activeIndex]
  const goTo = (index) => setActiveIndex((index + movies.length) % movies.length)

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured films"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {movies.map((item, index) => (
        <div
          key={item.id}
          className={`${styles.slide} ${index === activeIndex ? styles.slideActive : ''}`}
          aria-hidden={index !== activeIndex}
        >
          <img className={styles.backdrop} src={item.backdropUrl || item.posterUrl} alt="" />
        </div>
      ))}
      <div className={styles.overlay} />

      <div className={styles.content} key={movie.id}>
        <Badge size="medium" className={styles.label}>
          {getHeroLabel(movie)}
        </Badge>
        <h1 className={styles.title}>{movie.title}</h1>
        <div className={styles.badges}>
          <Badge size="medium">{movie.ageRating.code}</Badge>
          <Badge size="medium" variant="white" icon={timerIcon}>
            {movie.runtimeMinutes} Min
          </Badge>
          {movie.formats.map((format) => (
            <Badge key={format.id} size="medium" variant="white">
              {format.name}
            </Badge>
          ))}
        </div>
        <p className={styles.synopsis}>{movie.synopsis}</p>
        <div className={styles.actions}>
          <Button to={`/movies/${movie.slug}`} icon={ticketIcon}>
            Buy tickets
          </Button>
          <Button to="/sessions" variant="transparent">
            All sessions
          </Button>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.progress}>
          {movies.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.segment} ${index === activeIndex ? styles.segmentActive : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Show ${item.title}`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous film"
          >
            <img src={arrowIcon} alt="" width="34" height="34" />
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next film"
          >
            <img src={arrowIcon} alt="" width="34" height="34" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
