import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Skeleton from '../Skeleton/Skeleton'
import useDebouncedValue from '../../hooks/useDebouncedValue'
import { searchMovies } from '../../api/movies'
import { formatPrice } from '../../utils/format'
import searchIcon from '../../assets/icons/magnifying-glass.svg'
import styles from './SearchBox.module.css'

function PopcornIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9h14l-2 12H7L5 9Z" />
      <path d="M9.5 9 10 21M14.5 9 14 21" />
      <path d="M5.5 9a2.5 2.5 0 0 1 1.7-4.3A3 3 0 0 1 12 3.5a3 3 0 0 1 4.8 1.2A2.5 2.5 0 0 1 18.5 9" />
    </svg>
  )
}

// Bolds the part of the title that matches the query
function HighlightedTitle({ title, query }) {
  const index = title.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return <span className={styles.titleRest}>{title}</span>

  return (
    <>
      <span className={styles.titleRest}>{title.slice(0, index)}</span>
      <span className={styles.titleMatch}>{title.slice(index, index + query.length)}</span>
      <span className={styles.titleRest}>{title.slice(index + query.length)}</span>
    </>
  )
}

function SearchBox() {
  const [query, setQuery] = useState('')
  // The panel belongs to the page it was opened on, so navigating closes it
  const location = useLocation()
  const [openOnKey, setOpenOnKey] = useState(null)
  const isOpen = openOnKey === location.key
  const setIsOpen = (open) => setOpenOnKey(open ? location.key : null)
  const [state, setState] = useState({ query: '', results: [], error: null })
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const trimmed = query.trim()
  const debouncedQuery = useDebouncedValue(trimmed, 300)
  const isSearching = trimmed !== '' && state.query !== trimmed

  useEffect(() => {
    if (!debouncedQuery) return
    let isCancelled = false

    searchMovies(debouncedQuery)
      .then((results) => {
        if (!isCancelled) setState({ query: debouncedQuery, results, error: null })
      })
      .catch((error) => {
        if (!isCancelled) setState({ query: debouncedQuery, results: [], error })
      })

    return () => {
      isCancelled = true
    }
  }, [debouncedQuery])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (!wrapperRef.current.contains(event.target)) setOpenOnKey(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
      inputRef.current.blur()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    inputRef.current.blur()
    navigate(trimmed ? `/sessions?search=${encodeURIComponent(trimmed)}` : '/sessions')
  }

  const clear = () => {
    setQuery('')
    inputRef.current.focus()
  }

  const results = state.query === trimmed ? state.results : []

  return (
    <div className={`${styles.wrapper} ${isOpen ? styles.open : ''}`} ref={wrapperRef}>
      <form className={styles.field} role="search" onSubmit={handleSubmit}>
        <img src={searchIcon} alt="" width="14" height="14" />
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder="Search films and live events"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search films and live events"
          aria-expanded={isOpen}
          aria-controls="search-panel"
          maxLength={100}
        />
        {query && (
          <button type="button" className={styles.clear} onClick={clear} aria-label="Clear search">
            ×
          </button>
        )}
      </form>

      {isOpen && (
        <div className={styles.panel} id="search-panel">
          {!trimmed && (
            <div className={styles.message}>
              <span className={styles.messageIcon}>
                <PopcornIcon />
              </span>
              <p className={styles.messageTitle}>What do you want to watch?</p>
              <p className={styles.messageText}>Search by title, director or cast</p>
              <Link to="/sessions" className={styles.browse}>
                Browse all sessions
              </Link>
            </div>
          )}

          {isSearching && (
            <div className={styles.results} aria-busy="true">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className={styles.row}>
                  <Skeleton width={40} height={56} radius={6} />
                  <div className={styles.rowInfo}>
                    <Skeleton width={160} height={16} />
                    <Skeleton width={110} height={12} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && trimmed && state.error && (
            <div className={styles.message}>
              <p className={styles.messageTitle}>Search is unavailable right now</p>
              <p className={styles.messageText}>Please try again in a moment.</p>
            </div>
          )}

          {!isSearching && trimmed && !state.error && results.length === 0 && (
            <div className={styles.message}>
              <span className={styles.messageIcon}>
                <img src={searchIcon} alt="" width="20" height="20" />
              </span>
              <p className={styles.messageTitle}>No results for “{trimmed}”</p>
              <p className={styles.messageText}>
                Check the spelling or try another film or live event.
              </p>
              <Link to="/sessions" className={styles.browse}>
                Browse all sessions
              </Link>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <span className={styles.overline}>Films &amp; Events</span>
                <span className={styles.count}>
                  {results.length} {results.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              {results.map((movie) => (
                <Link key={movie.id} to={`/movies/${movie.slug}`} className={styles.row}>
                  <img className={styles.poster} src={movie.posterUrl} alt="" />
                  <div className={styles.rowInfo}>
                    <p className={styles.title}>
                      <HighlightedTitle title={movie.title} query={trimmed} />
                    </p>
                    <p className={styles.meta}>
                      {movie.kind === 'event' ? 'Live event' : 'Film'} · {movie.ageRating.code} ·{' '}
                      {movie.runtimeMinutes} min
                    </p>
                  </div>
                  {movie.isComingSoon ? (
                    <span className={styles.comingSoon}>Coming Soon</span>
                  ) : (
                    <span className={styles.price}>
                      from {formatPrice(movie.fromPrice).replace(' ', '')}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBox
