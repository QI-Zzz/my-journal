import { useEffect, useState } from 'react'
import { loadAllDailyEntries } from '../storage/storage'
import { DailyEntry, Mood } from '../types'

export type YearView = 'mood' | 'study' | 'exercise'

export type DayData = {
    date: string
    entry: DailyEntry | null
}

export type MonthData = {
    month: number    // 0-indexed
    label: string
    days: DayData[]
}

// ─── Color maps ────────────────────────────────────────
export const MOOD_COLOR: Record<Mood, string> = {
    'happy':            '#4CAF50',
    'neutral but happy':'#AED581',
    'neutral but sad':  '#FFB74D',
    'sad':              '#EF5350',
}

const pad = (n: number) => String(n).padStart(2, '0')

// ─── Hook ──────────────────────────────────────────────
export const useYearScreen = () => {
    const [year, setYear] = useState(new Date().getFullYear())
    const [view, setView] = useState<YearView>('mood')
    const [entryMap, setEntryMap] = useState<Map<string, DailyEntry>>(new Map())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const all = await loadAllDailyEntries()
            const map = new Map<string, DailyEntry>()
            all.filter(e => e.date.startsWith(`${year}`)).forEach(e => map.set(e.date, e))
            setEntryMap(map)
            setLoading(false)
        }
        load()
    }, [year])

    // ─── Build 12 month strips ─────────────────────────
    const months: MonthData[] = Array.from({ length: 12 }, (_, m) => {
        const daysInMonth = new Date(year, m + 1, 0).getDate()
        const label = new Date(year, m, 1).toLocaleDateString('en-US', { month: 'short' })
        const days: DayData[] = Array.from({ length: daysInMonth }, (_, d) => {
            const date = `${year}-${pad(m + 1)}-${pad(d + 1)}`
            return { date, entry: entryMap.get(date) ?? null }
        })
        return { month: m, label, days }
    })

    // ─── Legend for current view ───────────────────────
    const getDayColor = (day: DayData): string => {
        const { entry } = day
        if (!entry) return '#EBEBEB'        // no data
        if (view === 'mood') {
            return entry.mood ? MOOD_COLOR[entry.mood] : '#E0E0E0'
        }
        if (view === 'study') {
            return entry.log.study ? '#1E90FF' : '#E3F2FD'
        }
        // exercise
        return entry.log.sports.length > 0 ? '#CC5500' : '#FFF3E0'
    }

    // ─── Year summary counts ───────────────────────────
    const allEntries = Array.from(entryMap.values())
    const totalDays = allEntries.length
    const studiedDays   = allEntries.filter(e => e.log.study).length
    const exercisedDays = allEntries.filter(e => e.log.sports.length > 0).length
    const moodCounts = Object.fromEntries(
        (['happy', 'neutral but happy', 'neutral but sad', 'sad'] as Mood[]).map(m => [
            m, allEntries.filter(e => e.mood === m).length
        ])
    ) as Record<Mood, number>

    return {
        loading,
        year,
        setYear,
        view,
        setView,
        months,
        getDayColor,
        totalDays,
        studiedDays,
        exercisedDays,
        moodCounts,
    }
}
