import { DailyLog, FoodEntry, Mood, SportType, StudyType, Weather } from '@/types'
import DateTimePicker from '@react-native-community/datetimepicker'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Colors } from '../../constants/theme'
import { useTodayScreen } from '../../hooks/useTodayScreen'
import { styles } from '../../styles/todayStyles'

export default function Today() {
  const {
    entry, loading, formatDate, selectedDate,
    setSelectedDate, showDatePicker, setShowDatePicker,
    newTodoText, setNewTodoText, toggleTodo, addTodo, deleteTodo,
    updateMood, updateWeather, toggleBoolean, toggleSport,
    toggleStudy, addFood, deleteFood, newFoodText,
    setNewFoodText, updateGratitude, selectedMeal, setSelectedMeal,
    updateTimeTracking, showWakePicker, setShowWakePicker,
    showSleepPicker, setShowSleepPicker, formatTime,
    calculateSleepHours, updateLog,
  } = useTodayScreen()

  // ─── Static Lists ───────────────────────────────────────
  const booleanHabits = [
    { key: 'noSocialMedia', label: 'Social Media < 2H' },
    { key: 'read',          label: 'Read' },
    { key: 'noJunkFood',    label: 'No Junk Food' },
    { key: 'vitamin',       label: 'Vitamin' },
    { key: 'piano',         label: 'Piano' },
  ]

  const sportsList: { key: SportType, label: string }[] = [
    { key: 'weight training', label: 'Weight Training 🏋️' },
    { key: 'dance',           label: 'Dance 💃' },
    { key: 'ballet',          label: 'Ballet 🩰' },
    { key: 'boxing',          label: 'Boxing 🥊' },
    { key: 'bouldering',      label: 'Bouldering 🧗' },
    { key: 'climbing',        label: 'Climbing 🧗' },
    { key: 'yoga',            label: 'Yoga 🧘' },
    { key: 'pilate',          label: 'Pilate 🧘' },
    { key: 'running',         label: 'Running 🏃' },
    { key: 'others',          label: 'Others 💪' },
  ]

  const studylist: { key: StudyType, label: string }[] = [
    { key: 'programming', label: 'Programming 💻' },
    { key: 'dutch',       label: 'Dutch 🇳🇱' },
    { key: 'english',     label: 'English 🇬🇧' },
    { key: 'trading',     label: 'Trading 📈' },
    { key: 'project',     label: 'Project 🚀' },
  ]

  const moodList: { key: Mood, label: string }[] = [
    { key: 'happy',            label: '😄' },
    { key: 'neutral but happy',label: '🙂' },
    { key: 'neutral but sad',  label: '😕' },
    { key: 'sad',              label: '😢' },
  ]

  const weatherList: { key: Weather, label: string }[] = [
    { key: 'sunny',        label: '☀️' },
    { key: 'cloudy',       label: '☁️' },
    { key: 'rainy',        label: '🌧️' },
    { key: 'some sunshine',label: '🌤️' },
    { key: 'special',      label: '✨' },
  ]

  const mealList: { key: FoodEntry['meal'], label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch',     label: 'Lunch' },
  { key: 'dinner',    label: 'Dinner' },
  { key: 'snack',     label: 'Snack' },
]

  if (loading) return <Text>Loading...</Text>

  return (
    <View style={styles.container}>

      {/* ─── Hero Header ─── */}
      <View style={styles.hero}>
        <Text style={styles.heroDate}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
          }).toUpperCase()}
        </Text>
        <Text style={styles.heroTitle} onPress={() => setShowDatePicker(true)}>
          {formatDate(selectedDate)}
        </Text>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(selectedDate + 'T12:00:00')}
            mode="date"
            display="inline"
            onChange={(event, date) => {
              setShowDatePicker(false)
              if (date) setSelectedDate(date.toISOString().split('T')[0])
            }}
          />
        )}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* ─── Tasks ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {entry!.todos.map(todo => (
            <View key={todo.id} style={styles.todoRow}>
              <TouchableOpacity onPress={() => toggleTodo(todo.id)}>
                <View style={[styles.checkbox, todo.done && styles.checkboxDone]}>
                  {todo.done && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
              </TouchableOpacity>
              <Text style={[styles.todoText, todo.done && styles.todoTextDone]}>
                {todo.text}
              </Text>
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
            placeholder="+ Add task..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* ─── Daily Log ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Log</Text>

          {booleanHabits.map(habit => (
            <View key={habit.key} style={styles.boolRow}>
              <Text style={styles.boolLabel}>{habit.label}</Text>
              <TouchableOpacity onPress={() => toggleBoolean(habit.key as keyof DailyLog)}>
                <View style={[styles.toggle, entry!.log[habit.key as keyof DailyLog] === true && styles.toggleOn]}>
                  <View style={[styles.toggleThumb, entry!.log[habit.key as keyof DailyLog] === true && styles.toggleThumbOn]} />
                </View>
              </TouchableOpacity>
            </View>
          ))}

          <Text style={styles.chipLabel}>Did I exercise today?</Text>
          <View style={styles.chipGrid}>
            {sportsList.map(sport => (
              <TouchableOpacity
                key={sport.key}
                onPress={() => toggleSport(sport.key)}
                style={[styles.chip, entry!.log.sports.includes(sport.key) && styles.chipActive]}
              >
                <Text style={[styles.chipText, entry!.log.sports.includes(sport.key) && styles.chipTextActive]}>
                  {sport.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.chipLabel}>Did I study today?</Text>
          <View style={styles.chipGrid}>
            {studylist.map(study => (
              <TouchableOpacity
                key={study.key}
                onPress={() => toggleStudy(study.key)}
                style={[styles.chip, entry!.log.studylist.includes(study.key) && styles.chipActive]}
              >
                <Text style={[styles.chipText, entry!.log.studylist.includes(study.key) && styles.chipTextActive]}>
                  {study.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Food ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food</Text>
          {entry!.food.map(food => (
            <View key={food.id} style={styles.foodRow}>
              <Text style={styles.mealBadge}>
                {mealList.find(m => m.key === food.meal)?.label ?? food.meal}
              </Text>
              <Text style={styles.foodText}>{food.text}</Text>
              <TouchableOpacity onPress={() => deleteFood(food.id)}>
                <Text style={styles.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TextInput
            style={styles.input}
            value={newFoodText}
            onChangeText={setNewFoodText}
            onSubmitEditing={() => addFood(selectedMeal, newFoodText)}
            placeholder="+ What did you eat?"
            placeholderTextColor={Colors.textMuted}
          />
          <View style={styles.chipGrid}>
            {mealList.map(meal => (
              <TouchableOpacity
                key={meal.key}
                onPress={() => setSelectedMeal(meal.key)}
                style={[styles.chip, selectedMeal === meal.key && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedMeal === meal.key && styles.chipTextActive]}>
                  {meal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Mood ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood</Text>
          <View style={styles.moodRow}>
            {moodList.map(mood => (
              <TouchableOpacity
                key={mood.key}
                onPress={() => updateMood(mood.key)}
                style={[styles.moodBtn, entry!.mood === mood.key && styles.moodBtnActive]}
              >
                <Text style={styles.moodEmoji}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Weather ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather</Text>
          <View style={styles.weatherRow}>
            {weatherList.map(weather => (
              <TouchableOpacity
                key={weather.key}
                onPress={() => updateWeather(weather.key)}
                style={[styles.weatherChip, entry!.weather === weather.key && styles.weatherChipActive]}
              >
                <Text style={styles.weatherChipText}>{weather.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ─── Time Tracking ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Tracking</Text>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Wake up</Text>
            <TouchableOpacity onPress={() => setShowWakePicker(true)}>
              <Text style={styles.timeValue}>
                {entry!.timeTracking.wakeUpTime ? formatTime(entry!.timeTracking.wakeUpTime) : '--:--'}
              </Text>
            </TouchableOpacity>
          </View>
          {showWakePicker && (
            <DateTimePicker
              value={entry!.timeTracking.wakeUpTime ? new Date(entry!.timeTracking.wakeUpTime) : new Date()}
              mode="time"
              display="spinner"
              onChange={(event, date) => {
                setShowWakePicker(false)
                if (date) updateTimeTracking('wakeUpTime', date.toISOString())
              }}
            />
          )}

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Sleep</Text>
            <TouchableOpacity onPress={() => setShowSleepPicker(true)}>
              <Text style={styles.timeValue}>
                {entry!.timeTracking.sleepTime ? formatTime(entry!.timeTracking.sleepTime) : '--:--'}
              </Text>
            </TouchableOpacity>
          </View>
          {showSleepPicker && (
            <DateTimePicker
              value={entry!.timeTracking.sleepTime ? new Date(entry!.timeTracking.sleepTime) : new Date()}
              mode="time"
              display="spinner"
              onChange={(event, date) => {
                setShowSleepPicker(false)
                if (date) updateTimeTracking('sleepTime', date.toISOString())
              }}
            />
          )}

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Sleep hours</Text>
            <Text style={styles.timeValue}>
              {entry!.timeTracking.wakeUpTime && entry!.timeTracking.sleepTime
                ? calculateSleepHours(entry!.timeTracking.wakeUpTime, entry!.timeTracking.sleepTime)
                : '--'}
            </Text>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Social media (hrs)</Text>
            <TextInput
              style={styles.timeInput}
              value={entry!.timeTracking.socialMedia?.toString() ?? ''}
              onChangeText={(text) => updateTimeTracking('socialMedia', parseFloat(text) || 0)}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Study (hrs)</Text>
            <TextInput
              style={styles.timeInput}
              value={entry!.timeTracking.study?.toString() ?? ''}
              onChangeText={(text) => updateTimeTracking('study', parseFloat(text) || 0)}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>🚬 Cigarettes</Text>
            <TextInput
              style={styles.timeInput}
              value={entry!.log.cigarettes?.toString() ?? '0'}
              onChangeText={(text) => updateLog('cigarettes', parseInt(text) || 0)}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>😴 Deep sleep (hrs)</Text>
            <TextInput
              style={styles.timeInput}
              value={entry!.log.deepSleepHours?.toString() ?? '0'}
              onChangeText={(text) => updateLog('deepSleepHours', parseFloat(text) || 0)}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>💤 Sleep quality</Text>
            <View style={styles.batteryWrap}>
              <View style={styles.batteryBody}>
                {[1,2,3,4,5].map(i => (
                  <TouchableOpacity key={i} onPress={() => updateLog('sleepQuality', i)}>
                    <View style={[styles.batterySegment, entry!.log.sleepQuality >= i && styles.batterySegmentFilled]} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.batteryTip} />
            </View>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>⚡ Energy level</Text>
            <View style={styles.batteryWrap}>
              <View style={styles.batteryBody}>
                {[1,2,3,4,5].map(i => (
                  <TouchableOpacity key={i} onPress={() => updateLog('energyLevel', i)}>
                    <View style={[styles.batterySegment, entry!.log.energyLevel >= i && styles.batterySegmentFilled]} />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.batteryTip} />
            </View>
          </View>
        </View>

        {/* ─── Gratitude Journal ─── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gratitude Journal</Text>
          <TextInput
            style={styles.gratitudeInput}
            multiline={true}
            value={entry!.gratitude}
            onChangeText={(text) => updateGratitude(text)}
            placeholder="What are you grateful for today..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>

      </ScrollView>
    </View>
  )
}