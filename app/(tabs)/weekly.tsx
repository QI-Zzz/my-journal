import { Mood } from '@/types'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Colors, TabColors } from '../../constants/theme'
import { SleepInsights, useWeeklyScreen } from '../../hooks/useWeeklyScreen'
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

// ─── Web date picker ────────────────────────────────────
const WebDatePicker = ({ onJump, onClose }: { onJump: (date: Date) => void; onClose: () => void }) => {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [day, setDay] = useState(today.getDate())
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const DAYS = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 280, gap: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A1A' }}>Jump to week</Text>
        <select value={month} onChange={(e) => { setMonth(Number(e.target.value)); setDay(1) }} style={{ width: '100%', padding: '10px 12px', fontSize: 15, borderRadius: 8, border: '1px solid #eee', backgroundColor: '#f7f7f7', color: '#333' }}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select value={day} onChange={(e) => setDay(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', fontSize: 15, borderRadius: 8, border: '1px solid #eee', backgroundColor: '#f7f7f7', color: '#333' }}>
          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', fontSize: 15, borderRadius: 8, border: '1px solid #eee', backgroundColor: '#f7f7f7', color: '#333' }}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={onClose} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#f0f0f0', alignItems: 'center' }}>
            <Text style={{ color: '#666', fontWeight: '500' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onJump(new Date(year, month, day)); onClose() }} style={{ flex: 1, padding: 12, borderRadius: 10, backgroundColor: '#1A1A1A', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

// ─── Sleep Insight Cards ────────────────────────────────

const InsightNote = ({ text }: { text: string }) => (
  <View style={styles.insightNote}>
    <Text style={styles.insightNoteText}>{text}</Text>
  </View>
)

// Card 1 — Sleep consistency
const Card1Consistency = ({ s }: { s: SleepInsights }) => (
  <View style={styles.insightCard}>
    <Text style={styles.insightCardTitle}>Sleep consistency</Text>
    <View style={styles.insightStatGrid}>
      <View style={styles.insightStat}>
        <Text style={styles.insightStatVal}>{s.avgWakeTime}</Text>
        <Text style={styles.insightStatLbl}>Avg wake up</Text>
      </View>
      <View style={styles.insightStat}>
        <Text style={styles.insightStatVal}>{s.avgSleepHours > 0 ? `${s.avgSleepHours.toFixed(1)}h` : '--'}</Text>
        <Text style={styles.insightStatLbl}>Avg sleep</Text>
      </View>
      <View style={styles.insightStat}>
        <Text style={styles.insightStatVal}>{s.wakeTimeSpread > 0 ? `${s.wakeTimeSpread.toFixed(1)}h` : '--'}</Text>
        <Text style={styles.insightStatLbl}>Wake spread</Text>
      </View>
      <View style={styles.insightStat}>
        <Text style={styles.insightStatVal}>{s.avgWakeTime !== '--:--' ? `${s.consistencyPct}%` : '--'}</Text>
        <Text style={styles.insightStatLbl}>Consistency</Text>
      </View>
    </View>
    {s.avgWakeTime !== '--:--' && (
      <InsightNote
        text={`You woke within 1 hour of your average on ${s.consistencyPct >= 70 ? 'most' : 'some'} days. ${s.consistencyPct >= 70 ? 'Consistent wake times strengthen your circadian rhythm.' : 'Try to wake at a similar time each day.'}`}
      />
    )}
  </View>
)

// Card 2 — Sleep vs energy
const Card2Correlation = ({ s }: { s: SleepInsights }) => {
  if (!s.hasCorrelationData) return (
    <View style={styles.insightCard}>
      <Text style={styles.insightCardTitle}>Sleep vs energy</Text>
      <Text style={styles.insightEmpty}>Log sleep times and energy levels to see how sleep affects your energy.</Text>
    </View>
  )

  const maxEnergy = 5
  return (
    <View style={styles.insightCard}>
      <Text style={styles.insightCardTitle}>Does sleep affect your energy?</Text>

      {s.wellRestedEnergy > 0 && (
        <View style={styles.corrGroup}>
          <Text style={styles.corrGroupLabel}>8h+ sleep</Text>
          <View style={styles.corrBarRow}>
            <Text style={styles.corrBarTag}>Energy</Text>
            <View style={styles.corrBarBg}>
              <View style={[styles.corrBarFill, { width: `${(s.wellRestedEnergy / maxEnergy) * 100}%`, backgroundColor: TabColors.weekly }]} />
            </View>
            <Text style={[styles.corrBarVal, { color: TabColors.weekly }]}>{s.wellRestedEnergy.toFixed(1)}</Text>
          </View>
          <View style={styles.corrBarRow}>
            <Text style={styles.corrBarTag}>Quality</Text>
            <View style={styles.corrBarBg}>
              <View style={[styles.corrBarFill, { width: `${(s.wellRestedQuality / maxEnergy) * 100}%`, backgroundColor: TabColors.weekly }]} />
            </View>
            <Text style={[styles.corrBarVal, { color: TabColors.weekly }]}>{s.wellRestedQuality.toFixed(1)}</Text>
          </View>
        </View>
      )}

      {s.shortSleepEnergy > 0 && (
        <View style={styles.corrGroup}>
          <Text style={styles.corrGroupLabel}>Under 7h</Text>
          <View style={styles.corrBarRow}>
            <Text style={styles.corrBarTag}>Energy</Text>
            <View style={styles.corrBarBg}>
              <View style={[styles.corrBarFill, { width: `${(s.shortSleepEnergy / maxEnergy) * 100}%`, backgroundColor: Colors.textMuted }]} />
            </View>
            <Text style={styles.corrBarVal}>{s.shortSleepEnergy.toFixed(1)}</Text>
          </View>
          <View style={styles.corrBarRow}>
            <Text style={styles.corrBarTag}>Quality</Text>
            <View style={styles.corrBarBg}>
              <View style={[styles.corrBarFill, { width: `${(s.shortSleepQuality / maxEnergy) * 100}%`, backgroundColor: Colors.textMuted }]} />
            </View>
            <Text style={styles.corrBarVal}>{s.shortSleepQuality.toFixed(1)}</Text>
          </View>
        </View>
      )}

      {s.wellRestedEnergy > 0 && s.shortSleepEnergy > 0 && (
        <InsightNote
          text={
            s.wellRestedEnergy > s.shortSleepEnergy
              ? `Sleep makes a real difference for you. Well-rested nights give you ${((s.wellRestedEnergy / s.shortSleepEnergy - 1) * 100).toFixed(0)}% more energy.`
              : `Interesting — your energy levels are similar regardless of sleep duration this week.`
          }
        />
      )}
    </View>
  )
}

// Card 3 — Deep sleep efficiency
const Card3DeepSleep = ({ s }: { s: SleepInsights }) => {
  if (s.deepSleepStatus === 'no-data') return (
    <View style={styles.insightCard}>
      <Text style={styles.insightCardTitle}>Deep sleep efficiency</Text>
      <Text style={styles.insightEmpty}>Log deep sleep hours in the Today tab to see your sleep quality insights.</Text>
    </View>
  )

  const maxDeep = Math.max(...s.dailyDeepSleep.map(d => d.hours), 2.5)

  return (
    <View style={styles.insightCard}>
      <Text style={styles.insightCardTitle}>Deep sleep efficiency</Text>

      <View style={styles.deepSleepRow}>
        <View style={styles.deepSleepNumbers}>
          <Text style={styles.deepSleepVal}>{s.avgDeepSleep.toFixed(1)}h</Text>
          <Text style={styles.deepSleepSub}>avg deep sleep</Text>
          <Text style={styles.deepSleepPct}>{s.deepSleepPct}% of total</Text>
          <View style={[styles.deepBadge, s.deepSleepStatus === 'good' ? styles.deepBadgeGood : styles.deepBadgeWarn]}>
            <Text style={[styles.deepBadgeText, s.deepSleepStatus === 'good' ? styles.deepBadgeTextGood : styles.deepBadgeTextWarn]}>
              {s.deepSleepStatus === 'good' ? 'Healthy 20–25%' : 'Below 20%'}
            </Text>
          </View>
        </View>

        <View style={styles.deepDailyBars}>
          {s.dailyDeepSleep.map(({ day, hours }) => (
            <View key={day} style={styles.deepDayRow}>
              <Text style={styles.deepDayLabel}>{day}</Text>
              <View style={styles.deepBarBg}>
                <View style={[styles.deepBarFill, {
                  width: hours > 0 ? `${(hours / maxDeep) * 100}%` : '0%',
                  backgroundColor: hours >= 2 ? TabColors.weekly : Colors.textMuted,
                }]} />
              </View>
              <Text style={styles.deepBarVal}>{hours > 0 ? `${hours.toFixed(1)}h` : '--'}</Text>
            </View>
          ))}
        </View>
      </View>

      {s.highDeepQuality > 0 && s.lowDeepQuality > 0 && (
        <InsightNote
          text={`On nights with 2h+ deep sleep your quality rating averages ${s.highDeepQuality.toFixed(1)}/5 vs ${s.lowDeepQuality.toFixed(1)}/5 on lighter nights.`}
        />
      )}
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
    sleepInsights,
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
              <Text style={styles.statIcon}>📱</Text>
              <Text style={styles.statValue}>{avgSocialMedia > 0 ? `${avgSocialMedia.toFixed(1)}h` : '--'}</Text>
              <Text style={styles.statLabel}>Avg Social</Text>
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

        {/* ─── Sleep Insights ───────────────────────────────────────────────────
            Three cards, each answering a different sleep question.
            Cards show empty states if data isn't logged yet.
        ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep insights</Text>
          <Card1Consistency s={sleepInsights} />
          <Card2Correlation s={sleepInsights} />
          <Card3DeepSleep s={sleepInsights} />
        </View>

      </ScrollView>
    </View>
  )
}