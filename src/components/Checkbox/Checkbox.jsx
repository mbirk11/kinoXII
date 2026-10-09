import checkedIcon from '../../assets/icons/checkbox-checked.svg'
import styles from './Checkbox.module.css'

function Checkbox({ checked, onChange, label, hint }) {
  return (
    <label className={styles.row}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.box} aria-hidden="true">
        {checked && <img src={checkedIcon} alt="" width="18" height="18" />}
      </span>
      <span className={styles.label}>
        <span className={styles.text}>{label}</span>
        {hint && <span className={styles.hint}>· {hint}</span>}
      </span>
    </label>
  )
}

export default Checkbox
