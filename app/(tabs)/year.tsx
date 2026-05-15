import { Mood } from '@/types'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { GratitudeEntry, MOOD_COLOR, useYearScreen, YearView } from '../../hooks/useYearScreen'
import { styles } from '../../styles/yearStyles'

const VIEW_OPTIONS: { key: YearView; label: string }[] = [
  { key: 'mood',     label: 'Mood' },
  { key: 'study',    label: 'Study' },
  { key: 'exercise', label: 'Exercise' },
]

const MOOD_LABELS: Record<Mood, string> = {
  'happy':            'Happy',
  'neutral but happy':'Pretty good',
  'neutral but sad':  'Meh',
  'sad':              'Sad',
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const formatDay = (dateStr: string): string => {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Group gratitude entries by month ─────────────────────────────────────────
// KEY CONCEPT: reduce() transforms a flat array into a grouped object.
// We use the month number (0-11) as the key.
// Result: { 4: [{date, text}, ...], 3: [...], ... }

type MonthGroup = { monthIndex: number; label: string; entries: GratitudeEntry[] }

const groupByMonth = (entries: GratitudeEntry[]): MonthGroup[] => {
  const groups: Record<number, GratitudeEntry[]> = {}
  entries.forEach(e => {
    const m = new Date(e.date + 'T12:00:00').getMonth()
    if (!groups[m]) groups[m] = []
    groups[m].push(e)
  })
  // Sort months newest first
  return Object.entries(groups)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([m, entries]) => ({
      monthIndex: Number(m),
      label: MONTH_NAMES[Number(m)],
      entries,
    }))
}

export default function Year() {
  const {
    loading, year, setYear, view, setView,
    months, getDayColor,
    totalDays, studiedDays, exercisedDays, moodCounts,
    gratitudeEntries,
  } = useYearScreen()

  // ─── Track which months are expanded ──────────────────────────────────────
  // We default the current month to open, all others closed.
  // Set stores month indices (0-11) that are currently open.
  const currentMonth = new Date().getMonth()
  const [openMonths, setOpenMonths] = useState<Set<number>>(
    new Set([currentMonth])
  )

  const toggleMonth = (monthIndex: number) => {
    setOpenMonths(prev => {
      const next = new Set(prev)
      if (next.has(monthIndex)) next.delete(monthIndex)
      else next.add(monthIndex)
      return next
    })
  }

  if (loading) return <Text>Loading...</Text>

  const monthGroups = groupByMonth(gratitudeEntries)

  return (
    <View style={styles.container}>

      {/* ─── Hero ─── */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>YEAR IN REVIEW</Text>
        <Text style={styles.heroTitle}>{year}</Text>
        <View style={styles.heroNav}>
          <TouchableOpacity onPress={() => setYear(y => y - 1)}>
            <Text style={styles.heroNavBtn}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.heroNavYear}>{year}</Text>
          <TouchableOpacity onPress={() => setYear(y => y + 1)}>
            <Text style={styles.heroNavBtn}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* ─── Summary cards ─── */}
        <Text style={styles.sectionLabel}>Year at a glance</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{studiedDays}</Text>
            <Text style={styles.summaryLabel}>Study days</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{exercisedDays}</Text>
            <Text style={styles.summaryLabel}>Exercise days</Text>
          </View>
        </View>

        {/* ─── View toggle ─── */}
        <View style={styles.toggle}>
          {VIEW_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.toggleBtn, view === opt.key && styles.toggleBtnActive]}
              onPress={() => setView(opt.key)}
            >
              <Text style={[styles.toggleText, view === opt.key && styles.toggleTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Heat map ─── */}
        <Text style={styles.sectionLabel}>{year} — {view}</Text>
        {months.map(({ month, label, days }) => (
          <View key={month} style={styles.monthRow}>
            <Text style={styles.monthLabel}>{label}</Text>
            <View style={styles.daySquaresRow}>
              {days.map(day => (
                <View
                  key={day.date}
                  style={[styles.daySquare, { backgroundColor: getDayColor(day) }]}
                />
              ))}
            </View>
          </View>
        ))}

        {/* ─── Legend ─── */}
        <View style={styles.legend}>
          {view === 'mood' && (
            <>
              {(Object.entries(MOOD_COLOR) as [Mood, string][]).map(([mood, color]) => (
                <View key={mood} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: color }]} />
                  <Text style={styles.legendText}>{MOOD_LABELS[mood]}</Text>
                </View>
              ))}
            </>
          )}
          {view === 'study' && (
            <>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#1E90FF' }]} />
                <Text style={styles.legendText}>Studied</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E3F2FD' }]} />
                <Text style={styles.legendText}>No study</Text>
              </View>
            </>
          )}
          {view === 'exercise' && (
            <>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#CC5500' }]} />
                <Text style={styles.legendText}>Exercised</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFF3E0' }]} />
                <Text style={styles.legendText}>Rest day</Text>
              </View>
            </>
          )}
        </View>

        {/* ─── Gratitude Journal — grouped by month, collapsible ───────────────
            Each month header is tappable. Tapping toggles the entries below.
            The chevron (› / ˅) rotates to show open/closed state.
        ─── */}
        <Text style={styles.sectionLabel}>
          Gratitude Journal · {gratitudeEntries.length} entries
        </Text>

        {gratitudeEntries.length === 0 ? (
          <View style={styles.emptyGratitude}>
            <Text style={styles.emptyGratitudeText}>
              No gratitude entries yet for {year}.{'\n'}
              Start writing in the Today tab!
            </Text>
          </View>
        ) : (
          monthGroups.map(({ monthIndex, label, entries }) => {
            const isOpen = openMonths.has(monthIndex)
            return (
              <View key={monthIndex} style={styles.monthGroup}>

                {/* ─── Month header — tap to toggle ─── */}
                <TouchableOpacity
                  style={styles.monthGroupHeader}
                  onPress={() => toggleMonth(monthIndex)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.monthGroupLabel}>
                    {label} · {entries.length}
                  </Text>
                  <Text style={styles.monthGroupChevron}>
                    {isOpen ? '˅' : '›'}
                  </Text>
                </TouchableOpacity>

                {/* ─── Entries — only shown when open ─── */}
                {isOpen && entries.map(entry => (
                  <View key={entry.date} style={styles.gratitudeCard}>
                    <Text style={styles.gratitudeDate}>
                      {formatDay(entry.date)}
                    </Text>
                    <Text style={styles.gratitudeText}>{entry.text}</Text>
                  </View>
                ))}

              </View>
            )
          })
        )}

      </ScrollView>
    </View>
  )
}