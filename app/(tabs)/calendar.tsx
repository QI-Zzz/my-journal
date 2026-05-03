import { Mood } from '@/types'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
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

const Delta = ({ current, prev }: { current: number; prev: number }) => {
  if (prev === 0 || current === 0) return null
  const diff = current - prev
  const label = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}h`
  const style = diff > 0 ? styles.deltaPos : diff < 0 ? styles.deltaNeg : styles.deltaZero
  return <Text style={style}>{label}</Text>
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

  // ─── Month picker ───────────────────────────────────
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  // ─── Day-word sheet ─────────────────────────────────
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

      {/* ─── Month-jump picker ─── */}
      <Modal visible={showMonthPicker} transparent animationType="fade" onRequestClose={() => setShowMonthPicker(false)}>
        <TouchableOpacity style={styles.pickerOverlay} activeOpacity={1} onPress={() => setShowMonthPicker(false)}>
          <View style={styles.pickerCard}>
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="inline"
              onChange={(_, date) => {
                setShowMonthPicker(false)
                // prevMonth/nextMonth navigate by 1; we jump directly by setting via selectMonth
                // Since the hook uses separate year/month state via prevMonth/nextMonth,
                // we use the date to navigate by calling prevMonth/nextMonth the right number of times.
                // Simpler: expose a jumpToMonth in the hook. For now use the date's month difference.
                if (date) {
                  const today = new Date()
                  const diff = (date.getFullYear() - today.getFullYear()) * 12 + (date.getMonth() - today.getMonth())
                  if (diff > 0) for (let i = 0; i < diff; i++) nextMonth()
                  else for (let i = 0; i < Math.abs(diff); i++) prevMonth()
                }
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

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
                placeholder="e.g. productive"
                placeholderTextColor={Colors.textMuted}
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
