import { Link } from 'react-router-dom'
import styles from './Button.module.css'

function Button({
  variant = 'primary',
  icon,
  to,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const classes = `${styles.button} ${styles[variant]} ${className}`.trim()
  const content = (
    <>
      {icon && <img className={styles.icon} src={icon} alt="" />}
      {children}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  )
}

export default Button
