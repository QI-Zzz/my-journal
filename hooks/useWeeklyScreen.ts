import { useEffect, useState } from 'react'
import { loadDailyEntry, loadWeeklyData, saveWeeklyData } from '../storage/storage'
import { DailyEntry, TodoItem } from '../types'

// ─── Helpers ───────────────────────────────────────────
const getWeekKey = (mondayDate: string): string => {
    const date = new Date(mondayDate + 'T12:00:00')
    const start = new Date(date.getFullYear(), 0, 1)
    const diff = date.getTime() - start.getTime()
    const weekNum = Math.ceil((diff / 86400000 + start.getDay()) / 7)
    return `${date.getFullYear()}-W${weekNum}`
}

const getWeekStart = (date: Date): string => {
    const weekday = date.getDay()
    if (weekday === 0) {
        date.setDate(date.getDate() - 6)
    } else {
        date.setDate(date.getDate() - (weekday - 1))
    }
    return date.toISOString().split('T')[0]
}

const getWeekDates = (mondayDate: string): string[] => {
    const week: string[] = []
    const date = new Date(mondayDate)
    for (let i = 0; i < 7; i++) {
        week.push(date.toISOString().split('T')[0])
        date.setDate(date.getDate() + 1)
    }
    return week
}

// ─── Hook ──────────────────────────────────────────────
export const useWeeklyScreen = () => {
    // ─── State ─────────────────────────────────────────
    const [weekStart, setWeekStart] = useState(getWeekStart(new Date()))
    const weekDates = getWeekDates(weekStart)
    const [weekEntries, setWeekEntries] = useState<(DailyEntry | null)[]>([])
    const [loading, setLoading] = useState(true)

    // Weekly todos (separate from daily)
    const [weeklyTodos, setWeeklyTodos] = useState<TodoItem[]>([])
    const [newTodoText, setNewTodoText] = useState('')

    // ─── Load data ─────────────────────────────────────
    useEffect(() => {
        const fetchWeekData = async () => {
            setLoading(true)

            // Load 7 daily entries
            const entries = await Promise.all(
                weekDates.map(date => loadDailyEntry(date))
            )
            setWeekEntries(entries)

            // Load weekly todos
            const weekData = await loadWeeklyData(getWeekKey(weekStart))
            setWeeklyTodos(weekData ? weekData.todos : [])

            setLoading(false)
        }
        fetchWeekData()
    }, [weekStart])

    // ─── Save weekly todos helper ──────────────────────
    const saveWeeklyTodos = (todos: TodoItem[]) => {
        setWeeklyTodos(todos)
        saveWeeklyData({ week: getWeekKey(weekStart), todos })
    }

    // ─── Navigation ────────────────────────────────────
    const selectWeek = (date: Date) => {
        setWeekStart(getWeekStart(date))
    }

    // ─── Week label & range ────────────────────────────
    const getWeekNumber = (): number => {
        const date = new Date(weekStart)
        const start = new Date(date.getFullYear(), 0, 1)
        const diff = date.getTime() - start.getTime()
        return Math.ceil((diff / 86400000 + start.getDay()) / 7)
    }

    const getWeekRange = (): string => {
        const mon = new Date(weekStart)
        const sun = new Date(weekStart)
        sun.setDate(sun.getDate() + 6)
        const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        return `${fmt(mon)} – ${fmt(sun)}`
    }

    // ─── Todos ─────────────────────────────────────────
    const toggleTodo = (id: string) => {
        const updated = weeklyTodos.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        )
        saveWeeklyTodos(updated)
    }

    const addTodo = () => {
        if (newTodoText.trim() === '') return
        const newTodo: TodoItem = {
            id: Date.now().toString(),
            text: newTodoText,
            done: false,
            createdAt: new Date().toISOString(),
        }
        saveWeeklyTodos([...weeklyTodos, newTodo])
        setNewTodoText('')
    }

    const deleteTodo = (id: string) => {
        saveWeeklyTodos(weeklyTodos.filter(todo => todo.id !== id))
    }

    // ─── Highlights ────────────────────────────────────
    const getAvgTime = (field: 'sleep' | 'socialMedia' | 'study') => {
        const values = weekEntries
            .filter((item) => item !== null)
            .map(item => item.timeTracking[field])
            .filter((val): val is number => typeof val === 'number' && val > 0)
        const total = values.reduce((sum, time) => sum + time, 0)
        return values.length > 0 ? total / values.length : 0
    }

    const getWorkoutCount = () => {
        return weekEntries.reduce((count, entry) => {
            if (entry && entry.log.sports.length > 0) {
                return count + 1
            }
            return count
        }, 0)
    }

    // ─── Mood ──────────────────────────────────────────
    const getMoodStrip = () => {
        return weekEntries.map(entry => entry ? entry.mood ?? null : null)
    }

    // ─── Habits ────────────────────────────────────────
    const getHabitStreak = (field: 'read' | 'noJunkFood' | 'vitamin' | 'piano') => {
        return weekEntries.map(entry => entry ? entry.log[field] ?? null : null)
    }

    // ─── Return ────────────────────────────────────────
    return {
        // State
        loading,
        weekStart,
        weeklyTodos,
        newTodoText,
        setNewTodoText,

        // Navigation
        selectWeek,
        weekNumber: getWeekNumber(),
        weekRange: getWeekRange(),

        // Todos
        toggleTodo,
        addTodo,
        deleteTodo,

        // Highlights
        avgSleep: getAvgTime('sleep'),
        avgStudy: getAvgTime('study'),
        workoutCount: getWorkoutCount(),

        // Mood
        moodStrip: getMoodStrip(),

        // Habits
        habits: {
            read: getHabitStreak('read'),
            noJunkFood: getHabitStreak('noJunkFood'),
            vitamin: getHabitStreak('vitamin'),
            piano: getHabitStreak('piano'),
        },
    }
}