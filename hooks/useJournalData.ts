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
        const fetchEntry = async () =>{
            const data = await loadDailyEntry(targetDate)
            if (data !== null) {
                setEntry(data)
            }
            else {
                setEntry(createEmptyDailyEntry(targetDate) )
            }
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

