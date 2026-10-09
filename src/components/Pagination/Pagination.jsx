import arrowIcon from '../../assets/icons/arrow-left.svg'
import styles from './Pagination.module.css'

// 1 … 4 5 6 … 10
function getPageItems(page, lastPage) {
  const pages = new Set([1, lastPage, page - 1, page, page + 1])
  const sorted = [...pages].filter((item) => item >= 1 && item <= lastPage).sort((a, b) => a - b)

  return sorted.flatMap((item, index) => {
    const previous = sorted[index - 1]
    if (previous && item - previous > 1) return [`gap-${item}`, item]
    return [item]
  })
}

function Pagination({ page, lastPage, onChange }) {
  if (lastPage <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <img src={arrowIcon} alt="" width="20" height="20" />
        </button>

        {getPageItems(page, lastPage).map((item) =>
          typeof item === 'string' ? (
            <span key={item} className={styles.gap}>
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${styles.page} ${item === page ? styles.active : ''}`}
              onClick={() => onChange(item)}
              aria-current={item === page ? 'page' : undefined}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={`${styles.arrow} ${styles.next}`}
          onClick={() => onChange(page + 1)}
          disabled={page === lastPage}
          aria-label="Next page"
        >
          <img src={arrowIcon} alt="" width="20" height="20" />
        </button>
      </div>
      <p className={styles.summary}>
        Page {page} of {lastPage}
      </p>
    </nav>
  )
}

export default Pagination
