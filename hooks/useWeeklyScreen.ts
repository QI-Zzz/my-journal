import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
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
    const d = new Date(date)
    const weekday = d.getDay()
    if (weekday === 0) d.setDate(d.getDate() - 6)
    else d.setDate(d.getDate() - (weekday - 1))
    return d.toISOString().split('T')[0]
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

// ─── Sleep insight types ────────────────────────────────
export type SleepInsights = {
    // Card 1 — consistency
    avgWakeTime: string        // "08:14"
    avgSleepHours: number
    wakeTimeSpread: number     // hours between earliest and latest wake
    consistencyPct: number     // % of days within 1h of avg wake time

    // Card 2 — sleep vs energy correlation
    wellRestedEnergy: number   // avg energy on 8h+ nights (0 = no data)
    wellRestedQuality: number  // avg quality on 8h+ nights
    shortSleepEnergy: number   // avg energy on <7h nights
    shortSleepQuality: number  // avg quality on <7h nights
    hasCorrelationData: boolean

    // Card 3 — deep sleep
    avgDeepSleep: number       // hours
    deepSleepPct: number       // % of total sleep (0-100)
    deepSleepStatus: 'good' | 'low' | 'no-data'
    dailyDeepSleep: { day: string; hours: number }[]
    highDeepQuality: number    // avg quality on nights with 2h+ deep sleep
    lowDeepQuality: number     // avg quality on other nights
}

// ─── Hook ──────────────────────────────────────────────
export const useWeeklyScreen = () => {
    const [weekStart, setWeekStart] = useState(getWeekStart(new Date()))
    const weekDates = getWeekDates(weekStart)
    const [weekEntries, setWeekEntries] = useState<(DailyEntry | null)[]>([])
    const [loading, setLoading] = useState(true)
    const [weeklyTodos, setWeeklyTodos] = useState<TodoItem[]>([])
    const [newTodoText, setNewTodoText] = useState('')

    const fetchWeekData = useCallback(async () => {
        setLoading(true)
        const entries = await Promise.all(weekDates.map(date => loadDailyEntry(date)))
        setWeekEntries(entries)
        const weekKey = getWeekKey(weekStart)
        const weekData = await loadWeeklyData(weekKey)
        const existingTodos = weekData?.todos ?? []
        const existingTexts = new Set(existingTodos.map(t => t.text.trim().toLowerCase()))

        // Scan back up to 8 weeks for the most recent week that has todos
        let todos = existingTodos
        for (let i = 1; i <= 8; i++) {
            const prevMonday = new Date(weekStart + 'T12:00:00')
            prevMonday.setDate(prevMonday.getDate() - 7 * i)
            const prevWeekKey = getWeekKey(prevMonday.toISOString().split('T')[0])
            const prevWeekData = await loadWeeklyData(prevWeekKey)

            if (!prevWeekData || prevWeekData.todos.length === 0) continue

            const newCarried = prevWeekData.todos
                .filter(t => !t.done && !existingTexts.has(t.text.trim().toLowerCase()))
                .map(t => ({ ...t, id: `${Date.now()}-${Math.random()}`, carriedFrom: prevWeekKey }))

            if (newCarried.length > 0) {
                todos = [...newCarried, ...existingTodos]
                saveWeeklyData({ week: weekKey, todos })
            }
            break
        }

        setWeeklyTodos(todos)
        setLoading(false)
    }, [weekStart])

    useEffect(() => { fetchWeekData() }, [weekStart])
    useFocusEffect(useCallback(() => { fetchWeekData() }, [fetchWeekData]))

    const saveWeeklyTodos = (todos: TodoItem[]) => {
        setWeeklyTodos(todos)
        saveWeeklyData({ week: getWeekKey(weekStart), todos })
    }

    const selectWeek = (date: Date) => setWeekStart(getWeekStart(date))

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

    const toggleTodo = (id: string) => {
        saveWeeklyTodos(weeklyTodos.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo
        ))
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

    const deleteTodo = (id: string) =>
        saveWeeklyTodos(weeklyTodos.filter(todo => todo.id !== id))

    const editTodo = (id: string, newText: string) => {
        if (!newText.trim()) return
        saveWeeklyTodos(weeklyTodos.map(t => t.id === id ? { ...t, text: newText.trim() } : t))
    }

    // ─── Averages ──────────────────────────────────────
    const getAvgTime = (field: 'socialMedia' | 'study') => {
        const values = weekEntries
            .filter((item) => item !== null)
            .map(item => item.timeTracking[field])
            .filter((val): val is number => typeof val === 'number' && val > 0)
        const total = values.reduce((sum, time) => sum + time, 0)
        return values.length > 0 ? total / values.length : 0
    }

    // Helper: calculate sleep hours from a single entry
    const calcSleepHours = (entry: DailyEntry): number | null => {
        const { wakeUpTime, sleepTime } = entry.timeTracking
        if (!wakeUpTime || !sleepTime) return null
        const wake = new Date(wakeUpTime)
        const bed = new Date(sleepTime)
        let diff = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60)
        if (diff < 0) diff += 24
        return diff
    }

    const getAvgSleep = () => {
        const values = weekEntries
            .filter((item): item is DailyEntry => item !== null)
            .map(calcSleepHours)
            .filter((v): v is number => v !== null && v > 0)
        return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
    }

    const getWorkoutCount = () =>
        weekEntries.filter(e => e !== null && e.log.sports.length > 0).length

    const getMoodStrip = () =>
        weekEntries.map(entry => entry ? entry.mood ?? null : null)

    const getHabitStreak = (field: 'read' | 'noJunkFood' | 'vitamin' | 'piano') =>
        weekEntries.map(entry => entry ? entry.log[field] ?? null : null)

    // ─── Sleep insights ────────────────────────────────
    // KEY CONCEPT: we compute all three cards from the same weekEntries array.
    // Each card answers a different question:
    // Card 1 — are you consistent? (wake time variance)
    // Card 2 — does sleep duration affect your energy?
    // Card 3 — does deep sleep quality matter for you?

    const buildSleepInsights = (): SleepInsights => {
        const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const filled = weekEntries.filter((e): e is DailyEntry => e !== null)

        // ── Card 1: consistency ──
        const wakeMinutes = filled
            .filter(e => e.timeTracking.wakeUpTime)
            .map(e => {
                const d = new Date(e.timeTracking.wakeUpTime!)
                return d.getHours() * 60 + d.getMinutes()
            })

        const avgWakeMin = wakeMinutes.length > 0
            ? wakeMinutes.reduce((a, b) => a + b, 0) / wakeMinutes.length
            : 0

        const avgWakeHour = Math.floor(avgWakeMin / 60)
        const avgWakeMinute = Math.round(avgWakeMin % 60)
        const avgWakeTime = wakeMinutes.length > 0
            ? `${String(avgWakeHour).padStart(2, '0')}:${String(avgWakeMinute).padStart(2, '0')}`
            : '--:--'

        const spread = wakeMinutes.length > 1
            ? (Math.max(...wakeMinutes) - Math.min(...wakeMinutes)) / 60
            : 0

        // Consistency = % of days where wake time is within 60 min of average
        const consistentDays = wakeMinutes.filter(m => Math.abs(m - avgWakeMin) <= 60).length
        const consistencyPct = wakeMinutes.length > 0
            ? Math.round((consistentDays / wakeMinutes.length) * 100)
            : 0

        const avgSleepHours = getAvgSleep()

        // ── Card 2: sleep vs energy ──
        const wellRested = filled.filter(e => {
            const h = calcSleepHours(e)
            return h !== null && h >= 8 && e.log.energyLevel > 0
        })
        const shortSleep = filled.filter(e => {
            const h = calcSleepHours(e)
            return h !== null && h < 7 && e.log.energyLevel > 0
        })

        const avg = (arr: number[]) => arr.length > 0
            ? arr.reduce((a, b) => a + b, 0) / arr.length : 0

        const wellRestedEnergy  = avg(wellRested.map(e => e.log.energyLevel))
        const wellRestedQuality = avg(wellRested.map(e => e.log.sleepQuality))
        const shortSleepEnergy  = avg(shortSleep.map(e => e.log.energyLevel))
        const shortSleepQuality = avg(shortSleep.map(e => e.log.sleepQuality))
        const hasCorrelationData = wellRested.length > 0 || shortSleep.length > 0

        // ── Card 3: deep sleep ──
        const deepEntries = filled.filter(e =>
            (e.timeTracking.deepSleepHours ?? 0) > 0 && calcSleepHours(e) !== null
        )

        const avgDeepSleep = avg(deepEntries.map(e => e.timeTracking.deepSleepHours ?? 0))
        const deepSleepPct = avgSleepHours > 0 && avgDeepSleep > 0
            ? Math.round((avgDeepSleep / avgSleepHours) * 100)
            : 0

        const deepSleepStatus: SleepInsights['deepSleepStatus'] =
            deepEntries.length === 0 ? 'no-data'
            : deepSleepPct >= 20 && deepSleepPct <= 25 ? 'good'
            : 'low'

        const dailyDeepSleep = weekEntries.map((e, i) => ({
            day: DAY_LABELS[i],
            hours: e ? (e.timeTracking.deepSleepHours ?? 0) : 0,
        }))

        const highDeep = filled.filter(e =>
            (e.timeTracking.deepSleepHours ?? 0) >= 2 && e.log.sleepQuality > 0
        )
        const lowDeep = filled.filter(e =>
            (e.timeTracking.deepSleepHours ?? 0) > 0 &&
            (e.timeTracking.deepSleepHours ?? 0) < 2 &&
            e.log.sleepQuality > 0
        )

        const highDeepQuality = avg(highDeep.map(e => e.log.sleepQuality))
        const lowDeepQuality  = avg(lowDeep.map(e => e.log.sleepQuality))

        return {
            avgWakeTime,
            avgSleepHours,
            wakeTimeSpread: spread,
            consistencyPct,
            wellRestedEnergy,
            wellRestedQuality,
            shortSleepEnergy,
            shortSleepQuality,
            hasCorrelationData,
            avgDeepSleep,
            deepSleepPct,
            deepSleepStatus,
            dailyDeepSleep,
            highDeepQuality,
            lowDeepQuality,
        }
    }

    return {
        loading,
        weekStart,
        weeklyTodos,
        newTodoText,
        setNewTodoText,
        selectWeek,
        weekNumber: getWeekNumber(),
        weekRange: getWeekRange(),
        toggleTodo,
        addTodo,
        deleteTodo,
        editTodo,
        avgSleep: getAvgSleep(),
        avgStudy: getAvgTime('study'),
        avgSocialMedia: getAvgTime('socialMedia'),
        workoutCount: getWorkoutCount(),
        moodStrip: getMoodStrip(),
        habits: {
            read: getHabitStreak('read'),
            noJunkFood: getHabitStreak('noJunkFood'),
            vitamin: getHabitStreak('vitamin'),
            piano: getHabitStreak('piano'),
        },
        sleepInsights: buildSleepInsights(),
    }
}