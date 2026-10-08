import styles from './Badge.module.css'

function Badge({ variant = 'red', size = 'small', icon, children }) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {icon && <img src={icon} alt="" width="14" height="14" />}
      {children}
    </span>
  )
}

export default Badge
