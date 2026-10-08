import HeroSlider from './HeroSlider'
import NowPlayingSection from './NowPlayingSection'
import ComingSoonSection from './ComingSoonSection'
import styles from './HomePage.module.css'

function HomePage() {
  return (
    <>
      <HeroSlider />
      <div className={styles.sections}>
        <NowPlayingSection />
        <div className={styles.divider} />
        <ComingSoonSection />
      </div>
    </>
  )
}

export default HomePage
