import styles from './Badge.module.css'

function Badge({ variant = 'red', size = 'small', icon, className = '', children }) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className}`}>
      {icon && <img src={icon} alt="" width="14" height="14" />}
      {children}
    </span>
  )
}

export default Badge
