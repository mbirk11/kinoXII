import HeroSlider from './HeroSlider'
import NowPlayingSection from './NowPlayingSection'
import ComingSoonSection from './ComingSoonSection'
import RecentlyViewedSection from './RecentlyViewedSection'
import styles from './HomePage.module.css'

function HomePage() {
  return (
    <>
      <HeroSlider />
      <div className={styles.sections}>
        <RecentlyViewedSection />
        <NowPlayingSection />
        <div className={styles.divider} />
        <ComingSoonSection />
      </div>
    </>
  )
}

export default HomePage
