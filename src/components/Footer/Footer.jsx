import Logo from '../Logo/Logo'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} />
      <div className={styles.row}>
        <Logo size="small" />
        <p className={styles.copyright}>© 2026 Kino XII. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
