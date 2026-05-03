import { useState } from 'react'
import { DailyLog, FoodEntry, Mood, TimeTracking, TodoItem, Weather } from '../types'
import { getTodayDate, useJournalData } from './useJournalData'

export const useTodayScreen = () => {
  // ─── State ─────────────────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(getTodayDate())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<FoodEntry['meal']>('breakfast')
  const [newFoodText, setNewFoodText] = useState('')
  const { entry, loading, updateEntry } = useJournalData(selectedDate)
  const [showWakePicker, setShowWakePicker] = useState(false)
  const [showSleepPicker, setShowSleepPicker] = useState(false)

  // ─── Date ──────────────────────────────────────────────
const formatDate = (dateString: string): string => {
  const date = new Date(dateString + 'T12:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

const updateTimeTracking = (field: keyof TimeTracking, value: any) => {
  updateEntry({ ...entry!, timeTracking: { ...entry!.timeTracking, [field]: value } })
}

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const calculateSleepHours = (wakeUp: string, sleep: string) => {
  const wake = new Date(wakeUp)
  const bed = new Date(sleep)
  let diff = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60)
  if (diff < 0) diff += 24
  return diff.toFixed(1) + 'h'
}

  // ─── Todos ─────────────────────────────────────────────
  const toggleTodo = (id: string) => {
    const updatedTodos = entry!.todos.map(todo => {
      if (todo.id === id) {
        return {...todo, done: !todo.done}
      }
      return todo
      })
    updateEntry({...entry!, todos: updatedTodos})
  }
  const addTodo = () => {
    if (newTodoText.trim() === '') return
    const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText,
        done: false,
        createdAt: new Date().toDateString(),
    }
    updateEntry({...entry!, todos: [...entry!.todos, newTodo]})
    setNewTodoText('')
  }
  const deleteTodo = (id: string) => {
    const updatedTodos = entry!.todos.filter(todo => todo.id !== id)
    updateEntry({
        ...entry!,
        todos: updatedTodos
    })
  }

  // ─── Mood & Weather ────────────────────────────────────
  const updateMood = (mood: Mood) => {updateEntry({...entry!, mood})}
  const updateWeather = (weather: Weather) => {updateEntry({...entry!, weather})}

  // ─── Daily Log ─────────────────────────────────────────
  const toggleBoolean = (key: keyof DailyLog) => {
    updateEntry({
        ...entry!,
        log: {...entry!.log, [key]: !entry!.log[key]}
    })
  }
  const toggleSport = (sport: DailyLog['sports'][number]) => {
    if (entry!.log.sports.includes(sport)) {
        updateEntry({
            ...entry!,
            log: {...entry!.log, sports: entry!.log.sports.filter(s => s !== sport)}
        })
    }
    else {
        updateEntry({
            ...entry!,
            log: {...entry!.log, sports: [...entry!.log.sports, sport]}
        })
    }
  }
  const toggleStudy = (item: DailyLog['studylist'][number]) => {
    if (entry!.log.studylist.includes(item)) {
        updateEntry({
            ...entry!,
            log: {...entry!.log, studylist: entry!.log.studylist.filter(s => s !== item)}
        })
    }
    else {
        updateEntry({
            ...entry!,
            log: {...entry!.log, studylist: [...entry!.log.studylist, item]}
        })
    }
  }

  // ─── Food ──────────────────────────────────────────────
  const addFood = (meal: FoodEntry['meal'], text: string) => {
    if (newFoodText.trim() === '') return
    const newFood: FoodEntry = {
        id: Date.now().toString(),
        meal: meal,
        text: text,
    }
    updateEntry({...entry!, food: [...entry!.food, newFood]})
    setNewFoodText('')
  }
  const deleteFood = (id: string) => {
    const updatedFood = entry!.food.filter(food => food.id !== id)
    updateEntry({...entry!, food: updatedFood})
  }

  // ─── Gratitude ─────────────────────────────────────────
  const updateGratitude = (text: string) => {updateEntry({...entry!, gratitude: text})}

  const updateLog = (field: keyof DailyLog, value: any) => {
  updateEntry({ ...entry!, log: { ...entry!.log, [field]: value } })
}

  return {
    // state
    entry,
    loading,
    selectedDate,
    showDatePicker,
    newTodoText,
    newFoodText,
    selectedMeal,
    showWakePicker,
    showSleepPicker,
    // setters
    setSelectedDate,
    setShowDatePicker,
    setNewTodoText,
    setNewFoodText,
    setSelectedMeal,
    setShowWakePicker,
    setShowSleepPicker,
    // functions
    formatDate,
    toggleTodo,
    addTodo,
    deleteTodo,
    updateMood,
    updateWeather,
    toggleBoolean,
    toggleSport,
    toggleStudy,
    addFood,
    deleteFood,
    updateGratitude,
    updateTimeTracking,
    formatTime, 
    calculateSleepHours,
    updateLog,
  }
}