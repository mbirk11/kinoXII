import { useEffect, useRef, useState } from 'react'
import caretIcon from '../../assets/icons/caret-down.svg'
import styles from './SortDropdown.module.css'

function SortDropdown({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)
  const selected = options.find((option) => option.id === value) ?? options[0]

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (!wrapperRef.current.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const select = (id) => {
    setIsOpen(false)
    if (id !== value) onChange(id)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.prefix}>Sort:</span>
        <span className={styles.value}>{selected?.label}</span>
        <img
          className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`}
          src={caretIcon}
          alt=""
          width="16"
          height="16"
        />
      </button>

      {isOpen && (
        <ul className={styles.menu} role="listbox" aria-label="Sort sessions">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                className={`${styles.option} ${option.id === value ? styles.selected : ''}`}
                onClick={() => select(option.id)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SortDropdown
