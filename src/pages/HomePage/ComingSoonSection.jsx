import { useState } from 'react'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import HorizontalRow from '../../components/HorizontalRow/HorizontalRow'
import ComingSoonCard, {
  ComingSoonCardSkeleton,
} from '../../components/ComingSoonCard/ComingSoonCard'
import ErrorState from '../../components/ErrorState/ErrorState'
import useAsync from '../../hooks/useAsync'
import useAuth from '../../hooks/useAuth'
import { getComingSoon } from '../../api/movies'
import styles from './HomePage.module.css'

function ComingSoonSection() {
  const { user } = useAuth()
  // Refetch when the user changes so each card knows if a reminder is already set
  const { data: movies, isLoading, error, retry } = useAsync(getComingSoon, [user?.id])
  const [showAll, setShowAll] = useState(false)

  // Keyed by reminder state so cards reset when a refetch reports a different value
  const cards = movies?.map((movie) => (
    <ComingSoonCard key={`${movie.id}-${Boolean(movie.isNotified)}`} movie={movie} />
  ))

  return (
    <section className={styles.section}>
      <SectionHeader
        title="COMING SOON..."
        linkLabel={showAll ? 'Show less' : 'See all'}
        onLinkClick={movies?.length > 0 ? () => setShowAll((value) => !value) : undefined}
      />
      {isLoading && (
        <HorizontalRow>
          {Array.from({ length: 4 }, (_, index) => (
            <ComingSoonCardSkeleton key={index} />
          ))}
        </HorizontalRow>
      )}
      {error && <ErrorState message="We could not load upcoming films." onRetry={retry} />}
      {movies?.length === 0 && (
        <p className={styles.empty}>No upcoming films announced yet.</p>
      )}
      {movies?.length > 0 &&
        (showAll ? <div className={styles.grid}>{cards}</div> : <HorizontalRow>{cards}</HorizontalRow>)}
    </section>
  )
}

export default ComingSoonSection
