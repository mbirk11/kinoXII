import dotComplete from '../../assets/icons/status-dot-complete.svg'
import dotIncomplete from '../../assets/icons/status-dot-incomplete.svg'
import { getDisplayName, getInitials } from '../../utils/user'
import styles from './Avatar.module.css'

function Avatar({ user, size = 40 }) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size }}>
      {user.avatar ? (
        <img className={styles.image} src={user.avatar} alt="" />
      ) : (
        getInitials(getDisplayName(user))
      )}
      <img
        className={styles.statusDot}
        src={user.profileComplete ? dotComplete : dotIncomplete}
        alt={user.profileComplete ? 'Profile complete' : 'Profile incomplete'}
        width="10"
        height="10"
      />
    </span>
  )
}

export default Avatar
