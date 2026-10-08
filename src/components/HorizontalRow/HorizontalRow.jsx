import { useEffect, useRef, useState } from 'react'
import styles from './HorizontalRow.module.css'

// Horizontally scrollable row that fades its right edge while more content is hidden
function HorizontalRow({ gap = 20, children }) {
  const rowRef = useRef(null)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const row = rowRef.current
    const update = () => {
      setHasMore(row.scrollLeft + row.clientWidth < row.scrollWidth - 1)
    }

    update()
    row.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(row)

    return () => {
      row.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [children])

  return (
    <div className={styles.wrapper}>
      <div className={styles.row} ref={rowRef} style={{ gap }}>
        {children}
      </div>
      <div className={`${styles.fade} ${hasMore ? styles.fadeVisible : ''}`} />
    </div>
  )
}

export default HorizontalRow
