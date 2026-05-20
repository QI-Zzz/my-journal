import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { loadDailyEntry, loadMonthlyData, saveDailyEntry, saveMonthlyData } from '../storage/storage'
import { DailyEntry, Mood, TodoItem } from '../types'
import { createEmptyDailyEntry } from './useJournalData'

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

// ─── Food ranking types ─────────────────────────────────
export type FoodRankItem = {
    name: string
    count: number
    rank: number
}

export type FoodRanking = {
    breakfast: FoodRankItem[]
    lunch: FoodRankItem[]
    dinner: FoodRankItem[]
    snack: FoodRankItem[]
    totalMeals: number
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

const avgField = (list: DailyEntry[], field: 'socialMedia' | 'study'): number => {
    const vals = list
        .map(e => e.timeTracking[field])
        .filter((v): v is number => typeof v === 'number' && v > 0)
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

const avgSleepField = (list: DailyEntry[]): number => {
    const vals = list
        .filter(e => e.timeTracking.wakeUpTime && e.timeTracking.sleepTime)
        .map(e => {
            const wake = new Date(e.timeTracking.wakeUpTime!)
            const bed = new Date(e.timeTracking.sleepTime!)
            let diff = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60)
            if (diff < 0) diff += 24
            return diff
        })
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
}

// ─── Food ranking helper ────────────────────────────────
// KEY CONCEPT: we flatten all food entries across all days,
// group by meal type, then count occurrences of each food name.
// Foods with the same count share the same rank (dense ranking).
// e.g. 3 foods with count=2 all get rank 2, next gets rank 3.

const buildFoodRanking = (entries: DailyEntry[]): FoodRanking => {
    const counts: Record<string, Record<string, number>> = {
        breakfast: {}, lunch: {}, dinner: {}, snack: {},
    }

    // Count each food per meal type
    entries.forEach(entry => {
        entry.food.forEach(f => {
            const meal = f.meal as keyof typeof counts
            if (!counts[meal]) return
            const name = f.text.trim().toLowerCase()
            if (!name) return
            counts[meal][name] = (counts[meal][name] ?? 0) + 1
        })
    })

    // Convert to ranked array — same count = same rank
    const toRanked = (mealCounts: Record<string, number>): FoodRankItem[] => {
        const sorted = Object.entries(mealCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)

        let rank = 1
        return sorted.map((item, i) => {
            // Only increment rank if count changed (dense ranking)
            if (i > 0 && sorted[i].count < sorted[i - 1].count) rank = i + 1
            // Capitalise first letter for display
            const displayName = item.name.charAt(0).toUpperCase() + item.name.slice(1)
            return { name: displayName, count: item.count, rank }
        })
    }

    const totalMeals = entries.reduce((sum, e) => sum + e.food.length, 0)

    return {
        breakfast: toRanked(counts.breakfast),
        lunch: toRanked(counts.lunch),
        dinner: toRanked(counts.dinner),
        snack: toRanked(counts.snack),
        totalMeals,
    }
}

// ─── Hook ──────────────────────────────────────────────
export const useCalendarScreen = () => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const [year, setYear] = useState(today.getFullYear())
    const [month, setMonth] = useState(today.getMonth())
    const [entries, setEntries] = useState<(DailyEntry | null)[]>([])
    const [prevEntries, setPrevEntries] = useState<(DailyEntry | null)[]>([])
    const [monthlyTodos, setMonthlyTodos] = useState<TodoItem[]>([])
    const [newTodoText, setNewTodoText] = useState('')
    const [loading, setLoading] = useState(true)

    const monthKey = toMonthKey(year, month)
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const fetchData = useCallback(async () => {
        setLoading(true)
        const prevYear = month === 0 ? year - 1 : year
        const prevMonthIdx = month === 0 ? 11 : month - 1
        const [loaded, prevLoaded, data] = await Promise.all([
            loadMonthEntries(year, month),
            loadMonthEntries(prevYear, prevMonthIdx),
            loadMonthlyData(monthKey),
        ])
        setEntries(loaded)
        setPrevEntries(prevLoaded)
        setMonthlyTodos(data ? data.todos : [])
        setLoading(false)
    }, [year, month])

    useEffect(() => { fetchData() }, [year, month])
    useFocusEffect(useCallback(() => { fetchData() }, [fetchData]))

    const prevMonth = () => {
        if (month === 0) { setYear(y => y - 1); setMonth(11) }
        else setMonth(m => m - 1)
    }
    const nextMonth = () => {
        if (month === 11) { setYear(y => y + 1); setMonth(0) }
        else setMonth(m => m + 1)
    }

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

    const filled = entries.filter((e): e is DailyEntry => e !== null)
    const filledPrev = prevEntries.filter((e): e is DailyEntry => e !== null)

    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()
    const daysElapsed = isCurrentMonth ? today.getDate() : daysInMonth

    const MOODS: Mood[] = ['happy', 'neutral but happy', 'neutral but sad', 'sad']
    const moodDistribution: MoodBar[] = MOODS.map(mood => ({
        mood,
        count: filled.filter(e => e.mood === mood).length,
    }))

    const avgSleep       = avgSleepField(filled)
    const prevAvgSleep   = avgSleepField(filledPrev)
    const avgSocialMedia = avgField(filled, 'socialMedia')
    const avgStudy       = avgField(filled, 'study')
    const prevAvgSocialMedia = avgField(filledPrev, 'socialMedia')
    const prevAvgStudy       = avgField(filledPrev, 'study')

    const habitCount = (field: 'read' | 'noJunkFood' | 'vitamin' | 'piano' | 'noSocialMedia') =>
        filled.filter(e => e.log[field] === true).length

    const exerciseCount      = filled.filter(e => e.log.sports.length > 0).length
    const readCount          = habitCount('read')
    const noJunkFoodCount    = habitCount('noJunkFood')
    const vitaminCount       = habitCount('vitamin')
    const pianoCount         = habitCount('piano')
    const noSocialMediaCount = habitCount('noSocialMedia')

    const updateDayWord = async (date: string, word: string) => {
        const existing = await loadDailyEntry(date)
        const entry = existing ?? createEmptyDailyEntry(date)
        await saveDailyEntry({ ...entry, dayWord: word })
        const dayIndex = parseInt(date.split('-')[2], 10) - 1
        setEntries(prev => {
            const next = [...prev]
            next[dayIndex] = { ...entry, dayWord: word }
            return next
        })
    }

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

    const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', {
        month: 'long', year: 'numeric',
    })

    // Build food ranking from all filled entries this month
    const foodRanking = buildFoodRanking(filled)

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
        foodRanking,
    }
}