import AsyncStorage from '@react-native-async-storage/async-storage'
import { BucketItem, DailyEntry, FiveYearVision, FullBackup, GoalBoolean, GoalMeasurable, MonthlyData, TodoItem, WeeklyData } from '../types'

// ─── Keys ──────────────────────────────────────────────────
const KEYS = {
  daily: (date: string) => `journal_${date}`,
  measurableGoals: 'goals_measurable',
  booleanGoals: 'goals_boolean',
  bucketList: 'bucket_list',
  monthly: (month: string) => `monthly_${month}`,
  weekly: (week: string) => `weekly_${week}`,
  fiveYearVisions: 'five_year_visions',
}

// ─── Helpers ───────────────────────────────────────────────
const save = async (key: string, value: unknown) => {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}

const load = async <T>(key: string): Promise<T | null> => {
  const raw = await AsyncStorage.getItem(key)
  return raw ? JSON.parse(raw) : null
}

// ─── Daily ─────────────────────────────────────────────────
export const saveDailyEntry = (entry: DailyEntry) =>
  save(KEYS.daily(entry.date), entry)

export const loadDailyEntry = (date: string) =>
  load<DailyEntry>(KEYS.daily(date))

export const loadAllDailyEntries = async (): Promise<DailyEntry[]> => {
  const allKeys = await AsyncStorage.getAllKeys()
  const dailyKeys = allKeys.filter(k => k.startsWith('journal_'))
  const pairs = await AsyncStorage.multiGet(dailyKeys)
  return pairs
    .map(([_, value]) => value ? JSON.parse(value) : null)
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date))
}

// ─── Goals ─────────────────────────────────────────────────
export const saveMeasurableGoals = (goals: GoalMeasurable[]) =>
  save(KEYS.measurableGoals, goals)

export const loadMeasurableGoals = () =>
  load<GoalMeasurable[]>(KEYS.measurableGoals)

export const saveBooleanGoals = (goals: GoalBoolean[]) =>
  save(KEYS.booleanGoals, goals)

export const loadBooleanGoals = () =>
  load<GoalBoolean[]>(KEYS.booleanGoals)

// ─── Bucket List ───────────────────────────────────────────
export const saveBucketList = (items: BucketItem[]) =>
  save(KEYS.bucketList, items)

export const loadBucketList = () =>
  load<BucketItem[]>(KEYS.bucketList)

// ─── Monthly ───────────────────────────────────────────────
export const saveMonthlyData = (data: MonthlyData) =>
  save(KEYS.monthly(data.month), data)

export const loadMonthlyData = (month: string) =>
  load<MonthlyData>(KEYS.monthly(month))

// ─── Weekly ────────────────────────────────────────────────
export const saveWeeklyData = (data: WeeklyData) =>
  save(KEYS.weekly(data.week), data)

export const loadWeeklyData = (week: string) =>
  load<WeeklyData>(KEYS.weekly(week))

export const loadAllWeeklyData = async (): Promise<WeeklyData[]> => {
  const allKeys = await AsyncStorage.getAllKeys()
  const weeklyKeys = allKeys.filter(k => k.startsWith('weekly_'))
  const pairs = await AsyncStorage.multiGet(weeklyKeys)
  return pairs.map(([_, value]) => value ? JSON.parse(value) : null).filter(Boolean)
}

export const loadAllMonthlyData = async (): Promise<MonthlyData[]> => {
  const allKeys = await AsyncStorage.getAllKeys()
  const monthlyKeys = allKeys.filter(k => k.startsWith('monthly_'))
  const pairs = await AsyncStorage.multiGet(monthlyKeys)
  return pairs.map(([_, value]) => value ? JSON.parse(value) : null).filter(Boolean)
}

// ─── 5 Year Vision ─────────────────────────────────────────
export const saveFiveYearVisions = (visions: FiveYearVision[]) =>
  save(KEYS.fiveYearVisions, visions)

export const loadFiveYearVisions = () =>
  load<FiveYearVision[]>(KEYS.fiveYearVisions)

// ─── Full Backup Export ────────────────────────────────────
export const exportFullBackup = async (): Promise<FullBackup> => {
  const [
    dailyEntries,
    measurableGoals,
    booleanGoals,
    bucketList,
    fiveYearVisions,
  ] = await Promise.all([
    loadAllDailyEntries(),
    loadMeasurableGoals(),
    loadBooleanGoals(),
    loadBucketList(),
    loadFiveYearVisions(),
  ])

  const allKeys = await AsyncStorage.getAllKeys()
  const monthlyKeys = allKeys.filter(k => k.startsWith('monthly_'))
  const weeklyKeys = allKeys.filter(k => k.startsWith('weekly_'))

  const monthlyPairs = await AsyncStorage.multiGet(monthlyKeys)
  const weeklyPairs = await AsyncStorage.multiGet(weeklyKeys)

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    dailyEntries: dailyEntries ?? [],
    measurableGoals: measurableGoals ?? [],
    booleanGoals: booleanGoals ?? [],
    bucketList: bucketList ?? [],
    monthlyData: monthlyPairs.map(([_, v]) => v ? JSON.parse(v) : null).filter(Boolean),
    weeklyData: weeklyPairs.map(([_, v]) => v ? JSON.parse(v) : null).filter(Boolean),
    fiveYearVisions: fiveYearVisions ?? [],
  }
}

// ─── Full Backup Import ────────────────────────────────────
export const importFullBackup = async (backup: FullBackup): Promise<void> => {
  await Promise.all([
    saveMeasurableGoals(backup.measurableGoals),
    saveBooleanGoals(backup.booleanGoals),
    saveBucketList(backup.bucketList),
    saveFiveYearVisions(backup.fiveYearVisions),
    ...backup.dailyEntries.map(saveDailyEntry),
    ...backup.monthlyData.map(saveMonthlyData),
    ...backup.weeklyData.map(saveWeeklyData),
  ])
}

// ─── One-time cleanup: stale duplicate todos ────────────────
// Before the carry-forward fix, a todo was copied to the next period but
// never removed from its source, so old entries can hold duplicate copies
// of the same task text. This keeps only the copy in the most recent
// period per task and drops the older, stale ones.
const dedupeTodosAcrossPeriods = <T extends { todos: TodoItem[] }>(
  periods: T[],
  getKey: (period: T) => string,
  compareKeys: (a: string, b: string) => number
): { changed: T[]; removedCount: number } => {
  const sorted = [...periods].sort((a, b) => compareKeys(getKey(a), getKey(b)))
  const latestKeyForText = new Map<string, string>()

  for (const period of sorted) {
    const key = getKey(period)
    for (const todo of period.todos) {
      latestKeyForText.set(todo.text.trim().toLowerCase(), key)
    }
  }

  const changed: T[] = []
  let removedCount = 0

  for (const period of sorted) {
    const key = getKey(period)
    const todos = period.todos.filter(t => latestKeyForText.get(t.text.trim().toLowerCase()) === key)
    if (todos.length !== period.todos.length) {
      removedCount += period.todos.length - todos.length
      changed.push({ ...period, todos })
    }
  }

  return { changed, removedCount }
}

const compareWeekKeys = (a: string, b: string): number => {
  const [aYear, aWeek] = a.split('-W').map(Number)
  const [bYear, bWeek] = b.split('-W').map(Number)
  return aYear !== bYear ? aYear - bYear : aWeek - bWeek
}

export const cleanupDuplicateTodos = async (): Promise<{ daily: number; weekly: number; monthly: number }> => {
  const [dailyEntries, weeklyEntries, monthlyEntries] = await Promise.all([
    loadAllDailyEntries(),
    loadAllWeeklyData(),
    loadAllMonthlyData(),
  ])

  const daily = dedupeTodosAcrossPeriods(dailyEntries, e => e.date, (a, b) => a.localeCompare(b))
  const weekly = dedupeTodosAcrossPeriods(weeklyEntries, e => e.week, compareWeekKeys)
  const monthly = dedupeTodosAcrossPeriods(monthlyEntries, e => e.month, (a, b) => a.localeCompare(b))

  await Promise.all([
    ...daily.changed.map(saveDailyEntry),
    ...weekly.changed.map(saveWeeklyData),
    ...monthly.changed.map(saveMonthlyData),
  ])

  return { daily: daily.removedCount, weekly: weekly.removedCount, monthly: monthly.removedCount }
}

