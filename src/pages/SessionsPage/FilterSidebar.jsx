import Checkbox from '../../components/Checkbox/Checkbox'
import DateSelector from '../../components/DateSelector/DateSelector'
import Skeleton from '../../components/Skeleton/Skeleton'
import { getUpcomingDates } from '../../utils/format'
import styles from './SessionsPage.module.css'

const toggle = (list, value, isOn) =>
  isOn ? [...list, value] : list.filter((item) => item !== value)

// "Morning (before 12:00)" -> ["Morning", "before 12:00"]
function splitBandLabel(label) {
  const match = label.match(/^(.*?)\s*\((.*)\)$/)
  return match ? [match[1], match[2].replace(' - ', '–')] : [label, null]
}

function FilterGroup({ title, children }) {
  const titleId = `filter-${title.toLowerCase().replaceAll(' ', '-')}`
  return (
    <div className={styles.group} role="group" aria-labelledby={titleId}>
      <h3 id={titleId} className={styles.groupTitle}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function FilterSidebar({ options, filters, onChange, onClear, activeCount }) {
  if (!options) {
    return (
      <aside className={styles.sidebar} aria-busy="true">
        <h2 className={styles.sidebarTitle}>Filters</h2>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={styles.group}>
            <Skeleton width={70} height={12} />
            <Skeleton width="80%" height={16} />
            <Skeleton width="65%" height={16} />
            <Skeleton width="72%" height={16} />
          </div>
        ))}
      </aside>
    )
  }

  // Selected venues narrow the format list to what those venues can show
  const selectedVenues = options.venues.filter((venue) => filters.venues.includes(venue.slug))
  const availableFormats = selectedVenues.length
    ? options.formats.filter((format) =>
        selectedVenues.some((venue) => venue.formats.some((item) => item.slug === format.slug)),
      )
    : options.formats

  const handleVenueChange = (slug, isOn) => {
    const venues = toggle(filters.venues, slug, isOn)
    const allowed = options.venues
      .filter((venue) => venues.includes(venue.slug))
      .flatMap((venue) => venue.formats.map((format) => format.slug))
    const formats = venues.length
      ? filters.formats.filter((format) => allowed.includes(format))
      : filters.formats
    onChange({ venues, formats })
  }

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>Filters</h2>

      <FilterGroup title="Venue">
        {options.venues.map((venue) => (
          <Checkbox
            key={venue.slug}
            label={venue.name}
            hint={venue.city}
            checked={filters.venues.includes(venue.slug)}
            onChange={(isOn) => handleVenueChange(venue.slug, isOn)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Date">
        <DateSelector
          dates={getUpcomingDates(7)}
          value={filters.date}
          onChange={(date) => onChange({ date })}
        />
      </FilterGroup>

      <FilterGroup title="Format">
        {availableFormats.map((format) => (
          <Checkbox
            key={format.slug}
            label={format.name}
            checked={filters.formats.includes(format.slug)}
            onChange={(isOn) => onChange({ formats: toggle(filters.formats, format.slug, isOn) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Language">
        {options.languages.map((language) => (
          <Checkbox
            key={language.slug}
            label={language.name}
            checked={filters.languages.includes(language.slug)}
            onChange={(isOn) =>
              onChange({ languages: toggle(filters.languages, language.slug, isOn) })
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Time of day">
        {options.timeBands.map((band) => {
          const [label, hint] = splitBandLabel(band.label)
          return (
            <Checkbox
              key={band.id}
              label={label}
              hint={hint}
              checked={filters.bands.includes(band.id)}
              onChange={(isOn) => onChange({ bands: toggle(filters.bands, band.id, isOn) })}
            />
          )
        })}
      </FilterGroup>

      <div className={styles.sidebarFooter}>
        {activeCount > 0 && (
          <button type="button" className={styles.clearButton} onClick={onClear}>
            Clear filters
          </button>
        )}
        <p className={styles.activeCount}>
          {activeCount} {activeCount === 1 ? 'filter' : 'filters'} active
        </p>
      </div>
    </aside>
  )
}

export default FilterSidebar
