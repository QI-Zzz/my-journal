import { Mood } from '@/types'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../constants/theme'
import { useCalendarScreen } from '../../hooks/useCalendarScreen'
import { styles } from '../../styles/calendarStyles'

const DAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const MOOD_EMOJI: Record<Mood, string> = {
  happy: '😄',
  'neutral but happy': '🙂',
  'neutral but sad': '😕',
  sad: '😢',
}

const BAR_MAX_HEIGHT = 72
const fmtHours = (h: number) => h > 0 ? `${h.toFixed(1)}h` : '--'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const YEARS = Array.from({ length: 10 }, (_, i) => 2020 + i)

const Delta = ({ current, prev }: { current: number; prev: number }) => {
  if (prev === 0 || current === 0) return null
  const diff = current - prev
  const label = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}h`
  const style = diff > 0 ? styles.deltaPos : diff < 0 ? styles.deltaNeg : styles.deltaZero
  return <Text style={style}>{label}</Text>
}

// ─── Web month/year picker ──────────────────────────────────────────────────
// Two simple <select> dropdowns — works on every browser, opens native
// iOS scroll wheel automatically in Safari
const WebMonthPicker = ({
  currentLabel,
  onJump,
  onClose,
}: {
  currentLabel: string   // e.g. "May 2026"
  onJump: (date: Date) => void
  onClose: () => void
}) => {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())

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
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A1A' }}>Jump to month</Text>

        {/* Month dropdown */}
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
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
              const d = new Date(year, month, 1)
              onJump(d)
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

export default function Calendar() {
  const {
    loading, monthLabel, weeks, daysElapsed,
    prevMonth, nextMonth,
    moodDistribution,
    avgSleep, avgSocialMedia, avgStudy,
    prevAvgSleep, prevAvgSocialMedia, prevAvgStudy,
    exerciseCount, readCount, noJunkFoodCount, noSocialMediaCount,
    monthlyTodos, newTodoText, setNewTodoText,
    toggleTodo, addTodo, deleteTodo,
    updateDayWord,
  } = useCalendarScreen()

  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [wordCell, setWordCell] = useState<{ date: string; current: string } | null>(null)
  const [wordInput, setWordInput] = useState('')

  const openWordSheet = (date: string, current: string) => {
    setWordCell({ date, current })
    setWordInput(current)
  }
  const saveWord = async () => {
    if (wordCell) await updateDayWord(wordCell.date, wordInput.trim())
    setWordCell(null)
  }

  const jumpToMonth = (date: Date) => {
    const today = new Date()
    const diff = (date.getFullYear() - today.getFullYear()) * 12 + (date.getMonth() - today.getMonth())
    if (diff > 0) for (let i = 0; i < diff; i++) nextMonth()
    else for (let i = 0; i < Math.abs(diff); i++) prevMonth()
  }

  if (loading) return <Text>Loading...</Text>

  const maxMoodCount = Math.max(1, ...moodDistribution.map(m => m.count))

  const habit2x2 = [
    { label: 'Exercise',        count: exerciseCount },
    { label: 'Read',            count: readCount },
    { label: 'No Junk Food',    count: noJunkFoodCount },
    { label: 'No Social Media', count: noSocialMediaCount },
  ]

  return (
    <View style={styles.container}>

      {/* ─── Hero ─── */}
      <View style={styles.hero}>
        <Text style={styles.heroLabel}>CALENDAR</Text>
        <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
          <Text style={styles.heroTitle}>{monthLabel}</Text>
        </TouchableOpacity>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={prevMonth}>
            <Text style={styles.navBtn}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
            <Text style={styles.navLabel}>Jump to month</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextMonth}>
            <Text style={styles.navBtn}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Pickers — different per platform ─── */}
      {Platform.OS === 'web' ? (
        // Web: our custom dropdown modal
        showMonthPicker && (
          <WebMonthPicker
            currentLabel={monthLabel}
            onJump={jumpToMonth}
            onClose={() => setShowMonthPicker(false)}
          />
        )
      ) : (
        // Native: iOS inline calendar
        <Modal visible={showMonthPicker} transparent animationType="fade" onRequestClose={() => setShowMonthPicker(false)}>
          <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowMonthPicker(false)}>
            <View style={styles.pickerCard}>
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="inline"
                themeVariant="light"
                onChange={(_, date) => {
                  setShowMonthPicker(false)
                  if (date) jumpToMonth(date)
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* ─── Day-word sheet ─── */}
      <Modal visible={!!wordCell} transparent animationType="slide" onRequestClose={() => setWordCell(null)}>
        <TouchableOpacity style={styles.wordOverlay} activeOpacity={1} onPress={() => setWordCell(null)}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.wordSheet}>
              <Text style={styles.wordSheetTitle}>{wordCell?.date} — One word</Text>
              <TextInput
                style={styles.wordInput}
                value={wordInput}
                onChangeText={setWordInput}
                placeholderTextColor={Colors.textMuted}
                placeholder="e.g. grateful"
                autoFocus
                autoCapitalize="none"
                maxLength={20}
                onSubmitEditing={saveWord}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.wordSaveBtn} onPress={saveWord}>
                <Text style={styles.wordSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* ─── Calendar Grid ─── */}
        <View style={styles.gridSection}>
          <Text style={styles.gridLabel}>{monthLabel.toUpperCase()} — ONE WORD A DAY</Text>
          <View style={styles.gridCard}>
            <View style={styles.dayHeaderRow}>
              {DAY_HEADERS.map((d, i) => (
                <Text key={i} style={styles.dayHeader}>{d}</Text>
              ))}
            </View>
            {weeks.map((week, wi) => (
              <View key={wi} style={[styles.weekRow, wi === weeks.length - 1 && styles.weekRowLast]}>
                {week.map((cell, ci) => (
                  <TouchableOpacity
                    key={ci}
                    style={[
                      styles.cell,
                      ci === 6 && styles.cellLast,
                      !cell.day && styles.cellEmpty,
                      cell.isToday && styles.cellToday,
                    ]}
                    onPress={() => cell.date && openWordSheet(cell.date, cell.entry?.dayWord ?? '')}
                    disabled={!cell.day}
                    activeOpacity={0.7}
                  >
                    {cell.day ? (
                      <>
                        <Text style={[styles.dayNumber, cell.isToday && styles.dayNumberToday]}>
                          {cell.day}
                        </Text>
                        {cell.entry?.dayWord ? (
                          <Text style={[styles.cellWord, styles.cellWordFilled]} numberOfLines={1}>
                            {cell.entry.dayWord}
                          </Text>
                        ) : cell.isToday ? (
                          <Text style={styles.todayLabel}>today</Text>
                        ) : null}
                      </>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* ─── Mood Distribution ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Distribution</Text>
          <View style={styles.moodChartRow}>
            {moodDistribution.map(({ mood, count }) => (
              <View key={mood} style={styles.moodBarCol}>
                <Text style={styles.moodBarCount}>{count > 0 ? count : ''}</Text>
                <View style={[styles.moodBar, { height: Math.max(4, (count / maxMoodCount) * BAR_MAX_HEIGHT) }]} />
                <Text style={styles.moodEmoji}>{MOOD_EMOJI[mood]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Monthly Averages ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Averages</Text>
          <View style={styles.avgGrid}>
            <View style={styles.avgCard}>
              <Text style={styles.avgValue}>{fmtHours(avgSleep)}</Text>
              <Text style={styles.avgLabel}>Avg sleep</Text>
              <Delta current={avgSleep} prev={prevAvgSleep} />
            </View>
            <View style={styles.avgCard}>
              <Text style={styles.avgValue}>{fmtHours(avgSocialMedia)}</Text>
              <Text style={styles.avgLabel}>Avg social media</Text>
              <Delta current={avgSocialMedia} prev={prevAvgSocialMedia} />
            </View>
            <View style={styles.avgCard}>
              <Text style={styles.avgValue}>{fmtHours(avgStudy)}</Text>
              <Text style={styles.avgLabel}>Avg study</Text>
              <Delta current={avgStudy} prev={prevAvgStudy} />
            </View>
          </View>
        </View>

        {/* ─── Habit Completion 2×2 ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Completion</Text>
          <View style={styles.habitGrid2x2}>
            {habit2x2.map(({ label, count }) => (
              <View key={label} style={styles.habitGridCell}>
                <Text style={styles.habitGridCount}>{count}</Text>
                <Text style={styles.habitGridLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── Monthly Todos ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Todos</Text>
          {monthlyTodos.map(todo => (
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
            placeholder="+ Add monthly task..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

      </ScrollView>
    </View>
  )
}