import { Link } from 'react-router-dom'
import styles from './SectionHeader.module.css'

function SectionHeader({ title, linkTo, linkLabel = 'See all', onLinkClick }) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {linkTo && (
        <Link to={linkTo} className={styles.link}>
          {linkLabel}
        </Link>
      )}
      {onLinkClick && (
        <button type="button" className={styles.link} onClick={onLinkClick}>
          {linkLabel}
        </button>
      )}
    </div>
  )
}

export default SectionHeader
