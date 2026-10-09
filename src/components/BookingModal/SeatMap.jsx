import styles from './BookingModal.module.css'

const STATE_LABELS = {
  available: 'available',
  sold: 'sold',
  held: 'held by another user',
}

function rowRange(rows) {
  if (rows.length === 0) return ''
  const first = rows[0].label
  const last = rows[rows.length - 1].label
  return first === last ? `Row ${first}` : `Rows ${first}-${last}`
}

const MAP_WIDTH = 680
const ROW_LABEL_WIDTH = 28

// Largest seat size (max 52px) that lets the widest row fit the map column
function getSeatSizing(sections) {
  const rows = sections.flatMap((section) => section.rows)
  const widest = Math.max(
    ...rows.map((row) => ({
      seats: row.seats.length,
      aisles: row.seats.filter((seat) => seat.aisleAfter).length,
    })).map(({ seats, aisles }) => seats * 60 + aisles * 24),
  )
  const scale = Math.min(1, (MAP_WIDTH - ROW_LABEL_WIDTH) / widest)
  return {
    '--seat-size': `${Math.floor(52 * scale)}px`,
    '--seat-gap': `${Math.max(4, Math.floor(8 * scale))}px`,
    '--aisle-width': `${Math.floor(24 * scale)}px`,
  }
}

// Drawn straight from the API: sections > rows > seats, with aisles and gaps from the data
function SeatMap({ seatMap, selectedIds, onToggleSeat }) {
  return (
    <div className={styles.seatMap} style={getSeatSizing(seatMap.sections)}>
      <div className={styles.screen}>Screen</div>

      {seatMap.sections.map((section) => (
        <section key={section.name} className={styles.section} aria-label={section.name}>
          <p className={styles.sectionLabel}>
            {section.name} · {rowRange(section.rows)}
          </p>
          <div className={styles.rows}>
            {section.rows.map((row) => (
              <div key={row.label} className={styles.row}>
                <span className={styles.rowLabel}>{row.label}</span>
                {row.seats.map((seat) => {
                  const cell =
                    seat.state === 'unavailable' ? (
                      <span key={seat.id} className={styles.seatGap} aria-hidden="true" />
                    ) : (
                      <button
                        key={seat.id}
                        type="button"
                        className={`${styles.seat} ${styles[seat.state]} ${
                          selectedIds.has(seat.id) ? styles.selected : ''
                        }`}
                        disabled={seat.state !== 'available'}
                        aria-pressed={selectedIds.has(seat.id)}
                        aria-label={`Seat ${seat.code}, ${
                          selectedIds.has(seat.id) ? 'selected' : STATE_LABELS[seat.state]
                        }`}
                        onClick={() => onToggleSeat(seat)}
                      >
                        {seat.label}
                      </button>
                    )

                  return seat.aisleAfter
                    ? [cell, <span key={`${seat.id}-aisle`} className={styles.aisle} />]
                    : cell
                })}
              </div>
            ))}
          </div>
        </section>
      ))}

      <ul className={styles.legend}>
        <li>
          <span className={`${styles.legendSwatch} ${styles.available}`} /> Available
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.selected}`} /> Selected
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.sold}`} /> Sold
        </li>
        <li>
          <span className={`${styles.legendSwatch} ${styles.held}`} /> Held by another user
        </li>
      </ul>
    </div>
  )
}

export default SeatMap
