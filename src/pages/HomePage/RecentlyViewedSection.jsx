import { useState } from 'react'
import CompactMovieCard from '../../components/CompactMovieCard/CompactMovieCard'
import HorizontalRow from '../../components/HorizontalRow/HorizontalRow'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import { getRecentlyViewed } from '../../utils/recentlyViewed'
import styles from './HomePage.module.css'

function RecentlyViewedSection() {
  const [movies] = useState(getRecentlyViewed)

  if (movies.length === 0) return null

  return (
    <>
      <section className={`${styles.section} ${styles.recent}`}>
        <SectionHeader title="Recently viewed" />
        <HorizontalRow>
          {movies.map((movie) => (
            <CompactMovieCard key={movie.id} movie={movie} />
          ))}
        </HorizontalRow>
      </section>
      <div className={styles.divider} />
    </>
  )
}

export default RecentlyViewedSection
