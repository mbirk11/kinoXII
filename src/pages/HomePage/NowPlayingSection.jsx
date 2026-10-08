import SectionHeader from '../../components/SectionHeader/SectionHeader'
import HorizontalRow from '../../components/HorizontalRow/HorizontalRow'
import MovieCard, { MovieCardSkeleton } from '../../components/MovieCard/MovieCard'
import ErrorState from '../../components/ErrorState/ErrorState'
import useAsync from '../../hooks/useAsync'
import { getNowPlaying } from '../../api/movies'
import styles from './HomePage.module.css'

const HOME_LIMIT = 10

function NowPlayingSection() {
  const { data: movies, isLoading, error, retry } = useAsync(() =>
    getNowPlaying({ limit: HOME_LIMIT }),
  )

  return (
    <section className={styles.section}>
      <SectionHeader title="NOW PLAYING" linkTo="/sessions" />
      {isLoading && (
        <HorizontalRow gap={17}>
          {Array.from({ length: 6 }, (_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </HorizontalRow>
      )}
      {error && <ErrorState message="We could not load the films now playing." onRetry={retry} />}
      {movies?.length === 0 && (
        <p className={styles.empty}>No films are showing right now. Check back soon.</p>
      )}
      {movies?.length > 0 && (
        <HorizontalRow gap={17}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </HorizontalRow>
      )}
    </section>
  )
}

export default NowPlayingSection
