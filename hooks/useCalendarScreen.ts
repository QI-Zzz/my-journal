import { useEffect, useState } from 'react'
import { loadDailyEntry, loadMonthlyData, saveMonthlyData, saveDailyEntry } from '../storage/storage'
import { createEmptyDailyEntry } from './useJournalData'
import { DailyEntry, Mood, TodoItem } from '../types'

// ─── Types ─────────────────────────────────────────────
export type CalendarCell = {
    day: number | null
    date: string | null
    entry: DailyEntry | null
    isToday: boolean
}

export type MoodBar = {
    mood: Mood
    count: number
}

// ─── Helpers ───────────────────────────────────────────
const toMonthKey = (year: number, month: number): string =>
    `${year}-${String(month + 1).padStart(2, '0')}`

const toDateStr = (year: number, month: number, day: number): string =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

const loadMonthEntries = async (year: number, month: number): Promise<(DailyEntry | null)[]> => {
    const days = new Date(year, month + 1, 0).getDate()
    const dates = Array.from({ length: days }, (_, i) => toDateStr(year, month, i + 1))
    return Promise.all(dates.map(d => loadDailyEntry(d)))
}

const avgField = (list: DailyEntry[], field: 'sleep' | 'socialMedia' | 'study'): number => {
    const vals = list
        .map(e => e.timeTracking[field])
        .filter((v): v is number => typeof v === 'number' && v > 0)
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

// ─── Hook ──────────────────────────────────────────────
export const useCalendarScreen = () => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const [year, setYear] = useState(today.getFullYear())
    const [month, setMonth] = useState(today.getMonth())   // 0-indexed
    const [entries, setEntries] = useState<(DailyEntry | null)[]>([])
    const [prevEntries, setPrevEntries] = useState<(DailyEntry | null)[]>([])
    const [monthlyTodos, setMonthlyTodos] = useState<TodoItem[]>([])
    const [newTodoText, setNewTodoText] = useState('')
    const [loading, setLoading] = useState(true)

    const monthKey = toMonthKey(year, month)
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // ─── Load data ─────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const prevYear = month === 0 ? year - 1 : year
            const prevMonth = month === 0 ? 11 : month - 1

            const [loaded, prevLoaded, data] = await Promise.all([
                loadMonthEntries(year, month),
                loadMonthEntries(prevYear, prevMonth),
                loadMonthlyData(monthKey),
            ])

            setEntries(loaded)
            setPrevEntries(prevLoaded)
            setMonthlyTodos(data ? data.todos : [])
            setLoading(false)
        }
        fetchData()
    }, [year, month])

    // ─── Navigation ────────────────────────────────────
    const prevMonth = () => {
        if (month === 0) { setYear(y => y - 1); setMonth(11) }
        else setMonth(m => m - 1)
    }
    const nextMonth = () => {
        if (month === 11) { setYear(y => y + 1); setMonth(0) }
        else setMonth(m => m + 1)
    }

    // ─── Grid ──────────────────────────────────────────
    const rawFirstDay = new Date(year, month, 1).getDay()
    const startOffset = rawFirstDay === 0 ? 6 : rawFirstDay - 1

    const cells: CalendarCell[] = [
        ...Array.from({ length: startOffset }, () => ({
            day: null, date: null, entry: null, isToday: false,
        })),
        ...Array.from({ length: daysInMonth }, (_, i) => {
            const dateStr = toDateStr(year, month, i + 1)
            return {
                day: i + 1,
                date: dateStr,
                entry: entries[i] ?? null,
                isToday: dateStr === todayStr,
            }
        }),
    ]
    while (cells.length % 7 !== 0) {
        cells.push({ day: null, date: null, entry: null, isToday: false })
    }

    const weeks: CalendarCell[][] = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

    // ─── Derived data ──────────────────────────────────
    const filled = entries.filter((e): e is DailyEntry => e !== null)
    const filledPrev = prevEntries.filter((e): e is DailyEntry => e !== null)

    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()
    const daysElapsed = isCurrentMonth ? today.getDate() : daysInMonth

    // ─── Mood distribution ─────────────────────────────
    const MOODS: Mood[] = ['happy', 'neutral but happy', 'neutral but sad', 'sad']
    const moodDistribution: MoodBar[] = MOODS.map(mood => ({
        mood,
        count: filled.filter(e => e.mood === mood).length,
    }))

    // ─── Monthly averages ──────────────────────────────
    const avgSleep       = avgField(filled, 'sleep')
    const avgSocialMedia = avgField(filled, 'socialMedia')
    const avgStudy       = avgField(filled, 'study')
    const prevAvgSleep       = avgField(filledPrev, 'sleep')
    const prevAvgSocialMedia = avgField(filledPrev, 'socialMedia')
    const prevAvgStudy       = avgField(filledPrev, 'study')

    // ─── Habit completion ──────────────────────────────
    const habitCount = (field: 'read' | 'noJunkFood' | 'vitamin' | 'piano' | 'noSocialMedia') =>
        filled.filter(e => e.log[field] === true).length

    const exerciseCount    = filled.filter(e => e.log.sports.length > 0).length
    const readCount        = habitCount('read')
    const noJunkFoodCount  = habitCount('noJunkFood')
    const vitaminCount     = habitCount('vitamin')
    const pianoCount       = habitCount('piano')
    const noSocialMediaCount = habitCount('noSocialMedia')

    // ─── Day word ──────────────────────────────────────
    const updateDayWord = async (date: string, word: string) => {
        const existing = await loadDailyEntry(date)
        const entry = existing ?? createEmptyDailyEntry(date)
        await saveDailyEntry({ ...entry, dayWord: word })
        // Refresh the entries array for the current month
        const dayIndex = parseInt(date.split('-')[2], 10) - 1
        setEntries(prev => {
            const next = [...prev]
            next[dayIndex] = { ...entry, dayWord: word }
            return next
        })
    }

    // ─── Monthly todos ─────────────────────────────────
    const saveMonthlyTodos = (todos: TodoItem[]) => {
        setMonthlyTodos(todos)
        saveMonthlyData({ month: monthKey, todos })
    }

    const toggleTodo = (id: string) =>
        saveMonthlyTodos(monthlyTodos.map(t => t.id === id ? { ...t, done: !t.done } : t))

    const addTodo = () => {
        if (newTodoText.trim() === '') return
        const todo: TodoItem = {
            id: Date.now().toString(),
            text: newTodoText,
            done: false,
            createdAt: new Date().toISOString(),
        }
        saveMonthlyTodos([...monthlyTodos, todo])
        setNewTodoText('')
    }

    const deleteTodo = (id: string) =>
        saveMonthlyTodos(monthlyTodos.filter(t => t.id !== id))

    // ─── Labels ────────────────────────────────────────
    const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', {
        month: 'long', year: 'numeric',
    })

    // ─── Return ────────────────────────────────────────
    return {
        loading,
        monthLabel,
        weeks,
        todayStr,
        daysElapsed,
        prevMonth,
        nextMonth,

        moodDistribution,

        avgSleep, avgSocialMedia, avgStudy,
        prevAvgSleep, prevAvgSocialMedia, prevAvgStudy,

        exerciseCount, readCount, noJunkFoodCount,
        vitaminCount, pianoCount, noSocialMediaCount,

        updateDayWord,

        monthlyTodos,
        newTodoText,
        setNewTodoText,
        toggleTodo,
        addTodo,
        deleteTodo,
    }
}
