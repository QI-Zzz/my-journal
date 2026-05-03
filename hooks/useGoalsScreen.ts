import { useEffect, useState } from 'react'
import {
    loadBooleanGoals, loadFiveYearVisions, loadMeasurableGoals,
    saveBooleanGoals, saveFiveYearVisions, saveMeasurableGoals,
} from '../storage/storage'
import { FiveYearVision, GoalBoolean, GoalMeasurable, LifeArea } from '../types'

export const AREAS: LifeArea[] = ['career', 'finance', 'health', 'life', 'learning', 'experiences']

export const AREA_LABEL: Record<LifeArea, string> = {
    career:      'Career',
    finance:     'Finance',
    health:      'Health',
    life:        'Life',
    learning:    'Learning',
    experiences: 'Experiences',
}

export const AREA_COLOR: Record<LifeArea, string> = {
    career:      '#1E90FF',
    finance:     '#FFA500',
    health:      '#228B22',
    life:        '#E24B4A',
    learning:    '#9B59B6',
    experiences: '#CC5500',
}

// ─── Hook ──────────────────────────────────────────────
export const useGoalsScreen = () => {
    const [measurableGoals, setMeasurableGoals] = useState<GoalMeasurable[]>([])
    const [checklistGoals, setChecklistGoals] = useState<GoalBoolean[]>([])
    const [visions, setVisions] = useState<FiveYearVision[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            loadMeasurableGoals(),
            loadBooleanGoals(),
            loadFiveYearVisions(),
        ]).then(([m, b, v]) => {
            setMeasurableGoals(m ?? [])
            setChecklistGoals(b ?? [])
            setVisions(v ?? [])
            setLoading(false)
        })
    }, [])

    // ─── Days left in current year ──────────────────────
    const daysLeftInYear = (): number => {
        const today = new Date()
        const endOfYear = new Date(today.getFullYear(), 11, 31)
        return Math.max(0, Math.ceil((endOfYear.getTime() - today.getTime()) / 86400000))
    }

    // ─── Measurable goals ──────────────────────────────
    const addMeasurableGoal = (goal: Omit<GoalMeasurable, 'id'>) => {
        const updated = [...measurableGoals, { ...goal, id: Date.now().toString() }]
        setMeasurableGoals(updated)
        saveMeasurableGoals(updated)
    }

    const updateMeasurableGoal = (id: string, changes: Partial<GoalMeasurable>) => {
        const updated = measurableGoals.map(g => g.id === id ? { ...g, ...changes } : g)
        setMeasurableGoals(updated)
        saveMeasurableGoals(updated)
    }

    const deleteMeasurableGoal = (id: string) => {
        const updated = measurableGoals.filter(g => g.id !== id)
        setMeasurableGoals(updated)
        saveMeasurableGoals(updated)
    }

    // ─── Checklist goals ───────────────────────────────
    const addChecklistGoal = (title: string) => {
        const goal: GoalBoolean = { id: Date.now().toString(), title, done: false }
        const updated = [...checklistGoals, goal]
        setChecklistGoals(updated)
        saveBooleanGoals(updated)
    }

    const toggleChecklistGoal = (id: string) => {
        const updated = checklistGoals.map(g => g.id === id ? { ...g, done: !g.done } : g)
        setChecklistGoals(updated)
        saveBooleanGoals(updated)
    }

    const deleteChecklistGoal = (id: string) => {
        const updated = checklistGoals.filter(g => g.id !== id)
        setChecklistGoals(updated)
        saveBooleanGoals(updated)
    }

    // ─── 5-Year vision ─────────────────────────────────
    const getVision = (area: LifeArea): FiveYearVision =>
        visions.find(v => v.area === area) ?? { area, vision: '', goals: [] }

    const persistVision = (area: LifeArea, updated: FiveYearVision) => {
        const existing = visions.find(v => v.area === area)
        const list = existing
            ? visions.map(v => v.area === area ? updated : v)
            : [...visions, updated]
        setVisions(list)
        saveFiveYearVisions(list)
    }

    const toggleVisionGoal = (area: LifeArea, goalId: string) => {
        const vision = getVision(area)
        persistVision(area, {
            ...vision,
            goals: vision.goals.map(g => g.id === goalId ? { ...g, done: !g.done } : g),
        })
    }

    const addVisionGoal = (area: LifeArea, title: string, year?: number) => {
        const vision = getVision(area)
        const goal: GoalBoolean = { id: Date.now().toString(), title, done: false, year }
        persistVision(area, { ...vision, goals: [...vision.goals, goal] })
    }

    const deleteVisionGoal = (area: LifeArea, goalId: string) => {
        const vision = getVision(area)
        persistVision(area, {
            ...vision,
            goals: vision.goals.filter(g => g.id !== goalId),
        })
    }

    return {
        loading,
        measurableGoals,
        checklistGoals,
        visions,
        daysLeft: daysLeftInYear(),
        currentYear: new Date().getFullYear(),
        // Measurable
        addMeasurableGoal,
        updateMeasurableGoal,
        deleteMeasurableGoal,
        // Checklist
        addChecklistGoal,
        toggleChecklistGoal,
        deleteChecklistGoal,
        // Vision
        getVision,
        toggleVisionGoal,
        addVisionGoal,
        deleteVisionGoal,
    }
}
