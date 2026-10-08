import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import closeIcon from '../../assets/icons/close.svg'
import styles from './Modal.module.css'

function Modal({ isOpen, onClose, title, subtitle, className = '', children }) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <div className={`${styles.modal} ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.header}>
          <div className={styles.titles}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <img src={closeIcon} alt="" width="24" height="24" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
