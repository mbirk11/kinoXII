import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/Button/Button'
import Skeleton from '../../components/Skeleton/Skeleton'
import useAsync from '../../hooks/useAsync'
import useAuth from '../../hooks/useAuth'
import { getTickets } from '../../api/profile'
import MyTickets from './MyTickets'
import PersonalInfoForm from './PersonalInfoForm'
import styles from './ProfilePage.module.css'

const TABS = [
  { id: 'info', label: 'Personal Information' },
  { id: 'tickets', label: 'My Tickets' },
]

function ProfileContent({ user }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'tickets' ? 'tickets' : 'info'
  const upcoming = useAsync(() => getTickets('upcoming'), [user.id])

  const selectTab = (id) => setSearchParams(id === 'tickets' ? { tab: 'tickets' } : {})

  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label="Profile sections">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`${styles.tab} ${tab === id ? styles.tabActive : ''}`}
            onClick={() => selectTab(id)}
          >
            {label}
            {id === 'tickets' && upcoming.data?.length > 0 && (
              <span className={styles.tabCount}>{upcoming.data.length}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'info' ? (
        <PersonalInfoForm key={user.id} />
      ) : (
        <MyTickets onCountChange={upcoming.retry} />
      )}
    </>
  )
}

function ProfilePage() {
  const { user, isAuthLoading, openLogin } = useAuth()

  // The profile is private: guests are asked to log in and stay on this page
  useEffect(() => {
    if (!user && !isAuthLoading) openLogin()
  }, [user, isAuthLoading, openLogin])

  return (
    <div className={`page ${styles.profilePage}`}>
      <h1 className={styles.pageTitle}>My Profile</h1>
      {isAuthLoading && <Skeleton height={400} radius={20} />}
      {!isAuthLoading && !user && (
        <div className={styles.emptyTickets}>
          <p className={styles.emptyTitle}>Log in to see your profile</p>
          <p className={styles.emptyText}>Your personal details and tickets live here.</p>
          <Button onClick={openLogin}>Log in</Button>
        </div>
      )}
      {user && <ProfileContent user={user} />}
    </div>
  )
}

export default ProfilePage
