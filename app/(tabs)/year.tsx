import { Mood } from '@/types'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { MOOD_COLOR, YearView, useYearScreen } from '../../hooks/useYearScreen'
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

export default function Year() {
  const {
    loading, year, setYear, view, setView,
    months, getDayColor,
    totalDays, studiedDays, exercisedDays, moodCounts,
  } = useYearScreen()

  if (loading) return <Text>Loading...</Text>

  const topMood = (Object.entries(moodCounts) as [Mood, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0]

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
            <Text style={styles.summaryValue}>{totalDays}</Text>
            <Text style={styles.summaryLabel}>Days logged</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{studiedDays}</Text>
            <Text style={styles.summaryLabel}>Study days</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{exercisedDays}</Text>
            <Text style={styles.summaryLabel}>Exercise days</Text>
          </View>
          {topMood && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{moodCounts[topMood]}</Text>
              <Text style={styles.summaryLabel}>{MOOD_LABELS[topMood]}</Text>
            </View>
          )}
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
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#E0E0E0' }]} />
                <Text style={styles.legendText}>No mood</Text>
              </View>
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
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EBEBEB' }]} />
            <Text style={styles.legendText}>Not logged</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  )
}
