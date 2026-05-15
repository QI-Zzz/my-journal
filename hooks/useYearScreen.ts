import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { loadAllDailyEntries } from '../storage/storage'
import { DailyEntry, Mood } from '../types'

export type YearView = 'mood' | 'study' | 'exercise'

export type DayData = {
    date: string
    entry: DailyEntry | null
}

export type MonthData = {
    month: number
    label: string
    days: DayData[]
}

// ─── Gratitude entry for the journal list ──────────────
export type GratitudeEntry = {
    date: string
    text: string
}

export const MOOD_COLOR: Record<Mood, string> = {
    'happy':            '#EF5350',
    'neutral but happy':'#FFB74D',
    'neutral but sad':  '#AED581',
    'sad':              '#4CAF50',
}

const pad = (n: number) => String(n).padStart(2, '0')

export const useYearScreen = () => {
    const [year, setYear] = useState(new Date().getFullYear())
    const [view, setView] = useState<YearView>('mood')
    const [entryMap, setEntryMap] = useState<Map<string, DailyEntry>>(new Map())
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        setLoading(true)
        const all = await loadAllDailyEntries()
        const map = new Map<string, DailyEntry>()
        all.filter(e => e.date.startsWith(`${year}`)).forEach(e => map.set(e.date, e))
        setEntryMap(map)
        setLoading(false)
    }, [year])

    useEffect(() => { fetchData() }, [year])
    useFocusEffect(useCallback(() => { fetchData() }, [fetchData]))

    const months: MonthData[] = Array.from({ length: 12 }, (_, m) => {
        const daysInMonth = new Date(year, m + 1, 0).getDate()
        const label = new Date(year, m, 1).toLocaleDateString('en-US', { month: 'short' })
        const days: DayData[] = Array.from({ length: daysInMonth }, (_, d) => {
            const date = `${year}-${pad(m + 1)}-${pad(d + 1)}`
            return { date, entry: entryMap.get(date) ?? null }
        })
        return { month: m, label, days }
    })

    const getDayColor = (day: DayData): string => {
        const { entry } = day
        if (!entry) return '#EBEBEB'
        if (view === 'mood') {
            return entry.mood ? MOOD_COLOR[entry.mood] : '#E0E0E0'
        }
        if (view === 'study') {
            return entry.log.studylist.length > 0 ? '#1E90FF' : '#E3F2FD'
        }
        return entry.log.sports.length > 0 ? '#CC5500' : '#FFF3E0'
    }

    const allEntries = Array.from(entryMap.values())
    const totalDays     = allEntries.length
    const studiedDays   = allEntries.filter(e => e.log.studylist.length > 0).length
    const exercisedDays = allEntries.filter(e => e.log.sports.length > 0).length
    const moodCounts = Object.fromEntries(
        (['happy', 'neutral but happy', 'neutral but sad', 'sad'] as Mood[]).map(m => [
            m, allEntries.filter(e => e.mood === m).length
        ])
    ) as Record<Mood, number>

    // ─── Gratitude entries — sorted newest first, skip empty ──────────────────
    const gratitudeEntries: GratitudeEntry[] = allEntries
        .filter(e => e.gratitude && e.gratitude.trim().length > 0)
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(e => ({ date: e.date, text: e.gratitude }))

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
        gratitudeEntries,
    }
}