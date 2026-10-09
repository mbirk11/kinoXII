import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import ErrorState from '../../components/ErrorState/ErrorState'
import Pagination from '../../components/Pagination/Pagination'
import Skeleton from '../../components/Skeleton/Skeleton'
import SortDropdown from '../../components/SortDropdown/SortDropdown'
import useAsync from '../../hooks/useAsync'
import useAuth from '../../hooks/useAuth'
import useFilterOptions from '../../hooks/useFilterOptions'
import { getSessions } from '../../api/sessions'
import FilterSidebar from './FilterSidebar'
import SessionGroup, { SessionGroupSkeleton } from './SessionGroup'
import useSessionFilters from './useSessionFilters'
import styles from './SessionsPage.module.css'

function SessionsPage() {
  const { filters, updateFilters, clearFilters, activeFilterCount } = useSessionFilters()
  const { data: options, error: optionsError, retry: retryOptions } = useFilterOptions()
  const { requireAuth } = useAuth()
  const navigate = useNavigate()
  const listRef = useRef(null)

  const queryKey = JSON.stringify(filters)
  const { data: result, isLoading, error, retry } = useAsync(() => getSessions(filters), [queryKey])

  const groups = result?.data ?? []
  const meta = result?.meta

  // A page number past the end (e.g. an old link) falls back to the last real page
  useEffect(() => {
    if (meta && meta.lastPage > 0 && filters.page > meta.lastPage) {
      updateFilters({ page: meta.lastPage }, { replace: true })
    }
  }, [meta, filters.page, updateFilters])

  const changePage = (page) => {
    updateFilters({ page })
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Seat selection needs an account; guests log in first and continue automatically
  const handleSelectSession = (session) =>
    requireAuth(() => navigate(`/movies/${session.movie?.slug ?? ''}?session=${session.id}`))

  return (
    <div className={`page ${styles.sessionsPage}`}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Sessions</h1>
        <p className={styles.pageSubtitle}>Browse showtimes across all venues</p>
      </header>

      <div className={styles.layout}>
        {optionsError ? (
          <aside className={styles.sidebar}>
            <ErrorState message="We could not load the filters." onRetry={retryOptions} />
          </aside>
        ) : (
          <FilterSidebar
            options={options}
            filters={filters}
            onChange={updateFilters}
            onClear={clearFilters}
            activeCount={activeFilterCount}
          />
        )}

        <section className={styles.results} ref={listRef} aria-busy={isLoading}>
          <div className={styles.toolbar}>
            {isLoading ? (
              <Skeleton width={140} height={16} />
            ) : (
              <p className={styles.counter} aria-live="polite">
                {meta?.totalSessions
                  ? `Showing ${meta.totalSessions} ${meta.totalSessions === 1 ? 'session' : 'sessions'}`
                  : 'No sessions found'}
              </p>
            )}
            {options && (
              <SortDropdown
                options={options.sorts}
                value={filters.sort}
                onChange={(sort) => updateFilters({ sort })}
              />
            )}
          </div>

          {filters.search && (
            <div className={styles.searchChip}>
              Results for “{filters.search}”
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => updateFilters({ search: '' })}
                aria-label="Clear search"
              >
                ×
              </button>
            </div>
          )}

          {isLoading && (
            <div className={styles.groups}>
              {Array.from({ length: 3 }, (_, index) => (
                <SessionGroupSkeleton key={index} />
              ))}
            </div>
          )}

          {error && <ErrorState message="We could not load the sessions." onRetry={retry} />}

          {!isLoading && !error && groups.length === 0 && (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>No sessions found</p>
              <p className={styles.emptyText}>
                Nothing matches these filters on this date. Try another day or fewer filters.
              </p>
              {(activeFilterCount > 0 || filters.search) && (
                <Button variant="transparent" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          )}

          {!isLoading && !error && groups.length > 0 && (
            <>
              <div className={styles.groups}>
                {groups.map(({ movie, sessions }) => (
                  <SessionGroup
                    key={movie.id}
                    movie={movie}
                    sessions={sessions.map((session) => ({ ...session, movie }))}
                    onSelectSession={handleSelectSession}
                  />
                ))}
              </div>
              <Pagination page={meta.currentPage} lastPage={meta.lastPage} onChange={changePage} />
            </>
          )}
        </section>
      </div>
    </div>
  )
}

export default SessionsPage
