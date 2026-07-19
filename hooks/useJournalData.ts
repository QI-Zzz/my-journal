import { useEffect, useState } from 'react'
import { loadDailyEntry, saveDailyEntry } from '../storage/storage'
import { DailyEntry } from '../types'

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0] // "YYYY-MM-DD"
}

export const createEmptyDailyEntry = (date: string): DailyEntry => {
  return {
    date,
    mood: undefined,
    weather: undefined,
    log: {
      read: false,
      study: false,
      noSocialMedia: false,
      noJunkFood: false,
      vitamin: false,
      piano: false,
      sports: [],
      studylist: [],
      cigarettes: 0,
      sleepQuality: 0,
      energyLevel: 0,
    },
    food: [],
    todos: [],
    timeTracking: {
      sleep: 0,
      socialMedia: 0,
      study: 0,
      deepSleepHours: 0,
      wakeUpTime: undefined,
      sleepTime: undefined,
    },
    gratitude: '',
    dayWord: '',
  }
}

export const useJournalData = (date?: string) => {
    const [entry, setEntry] = useState<DailyEntry | null>(null)
    const today = getTodayDate()
    const targetDate = date ?? today
    
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEntry = async () => {
            const data = await loadDailyEntry(targetDate)
            const existing = data ?? createEmptyDailyEntry(targetDate)

            // Scan backward up to 30 days for the most recent day that has todos.
            // Uses text deduplication so the same task never appears twice.
            const existingTexts = new Set(existing.todos.map(t => t.text.trim().toLowerCase()))
            let finalEntry = existing

            for (let i = 1; i <= 30; i++) {
                const d = new Date(targetDate + 'T12:00:00')
                d.setDate(d.getDate() - i)
                const prevDate = d.toISOString().split('T')[0]
                const prevData = await loadDailyEntry(prevDate)

                // No entry or no todos on this day — keep scanning further back
                if (!prevData || prevData.todos.length === 0) continue

                // Found the most recent checkpoint. Carry any undone todos not already here.
                const toCarry = prevData.todos
                    .filter(t => !t.done && !existingTexts.has(t.text.trim().toLowerCase()))

                if (toCarry.length > 0) {
                    const newCarried = toCarry
                        .map(t => ({ ...t, id: `${Date.now()}-${Math.random()}`, carriedFrom: prevDate }))
                    finalEntry = { ...existing, todos: [...newCarried, ...existing.todos] }
                    await saveDailyEntry(finalEntry)

                    // Remove the carried todos from the source day so they aren't
                    // resurrected by a later scan if this day is ever emptied out.
                    const carriedIds = new Set(toCarry.map(t => t.id))
                    await saveDailyEntry({ ...prevData, todos: prevData.todos.filter(t => !carriedIds.has(t.id)) })
                }
                break  // Stop at the first checkpoint day regardless
            }

            setEntry(finalEntry)
            setLoading(false)
        }
        fetchEntry()  
    }, [date])

    const updateEntry = async (updatedEntry: DailyEntry) => {
        setEntry(updatedEntry)
        await saveDailyEntry(updatedEntry)
    }
    
    return { entry, updateEntry, loading }

}

