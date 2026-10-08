import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

function Logo({ size = 'large' }) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[size]}`} aria-label="KINO XII home">
      <span>KINO</span>
      <span className={styles.accent}>XII</span>
    </Link>
  )
}

export default Logo
