import HeroSlider from './HeroSlider'
import NowPlayingSection from './NowPlayingSection'
import styles from './HomePage.module.css'

function HomePage() {
  return (
    <>
      <HeroSlider />
      <div className={styles.sections}>
        <NowPlayingSection />
      </div>
    </>
  )
}

export default HomePage
