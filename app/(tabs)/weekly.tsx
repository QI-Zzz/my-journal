import { Mood } from '@/types'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../constants/theme'
import { useWeeklyScreen } from '../../hooks/useWeeklyScreen'
import { styles } from '../../styles/weeklyStyles'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const moodToEmoji = (mood: Mood | null | undefined): string => {
  if (!mood) return '·'
  const map: Record<Mood, string> = {
    happy: '😄',
    'neutral but happy': '🙂',
    'neutral but sad': '😕',
    sad: '😢',
  }
  return map[mood]
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const YEARS = Array.from({ length: 10 }, (_, i) => 2020 + i)

// ─── Web date picker ────────────────────────────────────────────────────────
// Pick any date within the week you want — we jump to that week
const WebDatePicker = ({
  onJump,
  onClose,
}: {
  onJump: (date: Date) => void
  onClose: () => void
}) => {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [day, setDay] = useState(today.getDate())

  // How many days in the selected month/year
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <View style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center', alignItems: 'center',
      zIndex: 999,
    }}>
      <View style={{
        backgroundColor: '#fff', borderRadius: 16, padding: 24,
        width: 280, gap: 16,
      }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A1A' }}>Jump to week</Text>

        {/* Month dropdown */}
        <select
          value={month}
          onChange={(e) => {
            setMonth(Number(e.target.value))
            setDay(1) // reset day when month changes
          }}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 15,
            borderRadius: 8, border: '1px solid #eee',
            backgroundColor: '#f7f7f7', color: '#333',
          }}
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>

        {/* Day dropdown */}
        <select
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 15,
            borderRadius: 8, border: '1px solid #eee',
            backgroundColor: '#f7f7f7', color: '#333',
          }}
        >
          {DAYS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Year dropdown */}
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 15,
            borderRadius: 8, border: '1px solid #eee',
            backgroundColor: '#f7f7f7', color: '#333',
          }}
        >
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            onPress={onClose}
            style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center' }}
          >
            <Text style={{ color: '#666', fontWeight: '500' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onJump(new Date(year, month, day))
              onClose()
            }}
            style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#1A1A1A', alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default function Weekly() {
  const {
    loading, weekStart, weeklyTodos, newTodoText, setNewTodoText,
    selectWeek, weekNumber, weekRange,
    toggleTodo, addTodo, deleteTodo,
    avgSleep, avgStudy, workoutCount,
    moodStrip, habits, avgSocialMedia,
  } = useWeeklyScreen()

  const [showPicker, setShowPicker] = useState(false)

  const goToPrevWeek = () => {
    const d = new Date(weekStart + 'T12:00:00')
    d.setDate(d.getDate() - 7)
    selectWeek(d)
  }

  const goToNextWeek = () => {
    const d = new Date(weekStart + 'T12:00:00')
    d.setDate(d.getDate() + 7)
    selectWeek(d)
  }

  const habitRows = [
    { key: 'read' as const,       label: 'Read',         data: habits.read },
    { key: 'noJunkFood' as const, label: 'No Junk Food', data: habits.noJunkFood },
    { key: 'vitamin' as const,    label: 'Vitamin',      data: habits.vitamin },
    { key: 'piano' as const,      label: 'Piano',        data: habits.piano },
  ]

  if (loading) return <Text>Loading...</Text>

  return (
    <View style={styles.container}>

      {/* ─── Hero ─── */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>WEEK {weekNumber}</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={styles.heroTitle}>{weekRange}</Text>
        </TouchableOpacity>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={goToPrevWeek}>
            <Text style={styles.navBtn}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text style={styles.navLabel}>Jump to date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextWeek}>
            <Text style={styles.navBtn}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Pickers — different per platform ─── */}
      {Platform.OS === 'web' ? (
        showPicker && (
          <WebDatePicker
            onJump={(date) => selectWeek(date)}
            onClose={() => setShowPicker(false)}
          />
        )
      ) : (
        <Modal visible={showPicker} transparent animationType="fade" onRequestClose={() => setShowPicker(false)}>
          <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowPicker(false)}>
            <View style={styles.pickerCard}>
              <DateTimePicker
                value={new Date(weekStart + 'T12:00:00')}
                mode="date"
                display="inline"
                themeVariant="light"
                onChange={(_, date) => {
                  setShowPicker(false)
                  if (date) selectWeek(date)
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* ─── Highlights ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <View style={styles.highlightGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>😴</Text>
              <Text style={styles.statValue}>{avgSleep > 0 ? `${avgSleep.toFixed(1)}h` : '--'}</Text>
              <Text style={styles.statLabel}>Avg Sleep</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={styles.statValue}>{avgStudy > 0 ? `${avgStudy.toFixed(1)}h` : '--'}</Text>
              <Text style={styles.statLabel}>Avg Study</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📚</Text>
              <Text style={styles.statValue}>{avgSocialMedia > 0 ? `${avgSocialMedia.toFixed(1)}h` : '--'}</Text>
              <Text style={styles.statLabel}>Avg Social Media</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💪</Text>
              <Text style={styles.statValue}>{workoutCount}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>
        </View>

        {/* ─── Mood Strip ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood</Text>
          <View style={styles.stripRow}>
            {DAY_LABELS.map((day, i) => (
              <View key={day} style={styles.dayCol}>
                <Text style={styles.dayLabel}>{day}</Text>
                {moodStrip[i] ? (
                  <Text style={styles.moodEmoji}>{moodToEmoji(moodStrip[i])}</Text>
                ) : (
                  <Text style={styles.moodEmpty}>·</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* ─── Habit Tracker ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habits</Text>
          <View style={styles.habitHeader}>
            <View style={styles.habitNameCell} />
            <View style={styles.habitDayLabels}>
              {DAY_LABELS.map(day => (
                <Text key={day} style={styles.habitDayLabel}>{day}</Text>
              ))}
            </View>
          </View>
          {habitRows.map(habit => (
            <View key={habit.key} style={styles.habitRow}>
              <Text style={styles.habitName}>{habit.label}</Text>
              <View style={styles.habitDots}>
                {habit.data.map((val, i) => (
                  <View key={i} style={styles.habitDotWrap}>
                    <View style={[
                      styles.habitDot,
                      val === null ? styles.habitDotNull : val ? styles.habitDotDone : undefined,
                    ]} />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* ─── Week Tasks ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Week Tasks</Text>
          {weeklyTodos.map(todo => (
            <View key={todo.id} style={styles.todoRow}>
              <TouchableOpacity onPress={() => toggleTodo(todo.id)}>
                <View style={[styles.checkbox, todo.done && styles.checkboxDone]}>
                  {todo.done && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
              </TouchableOpacity>
              <Text style={[styles.todoText, todo.done && styles.todoTextDone]}>{todo.text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                <Text style={styles.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            style={styles.input}
            value={newTodoText}
            onChangeText={setNewTodoText}
            onSubmitEditing={addTodo}
            placeholder="+ Add weekly task..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

      </ScrollView>
    </View>
  )
}