import AsyncStorage from '@react-native-async-storage/async-storage'
import { BucketItem, DailyEntry, FiveYearVision, FullBackup, GoalBoolean, GoalMeasurable, MonthlyData, Note, WeeklyData } from '../types'

// ─── Keys ──────────────────────────────────────────────────
const KEYS = {
  daily: (date: string) => `journal_${date}`,
  measurableGoals: 'goals_measurable',
  booleanGoals: 'goals_boolean',
  bucketList: 'bucket_list',
  monthly: (month: string) => `monthly_${month}`,
  weekly: (week: string) => `weekly_${week}`,
  notes: 'notes',
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

// ─── Notes ─────────────────────────────────────────────────
export const saveNotes = (notes: Note[]) =>
  save(KEYS.notes, notes)

export const loadNotes = () =>
  load<Note[]>(KEYS.notes)

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
    notes,
    fiveYearVisions,
  ] = await Promise.all([
    loadAllDailyEntries(),
    loadMeasurableGoals(),
    loadBooleanGoals(),
    loadBucketList(),
    loadNotes(),
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
    notes: notes ?? [],
    fiveYearVisions: fiveYearVisions ?? [],
  }
}

// ─── Full Backup Import ────────────────────────────────────
export const importFullBackup = async (backup: FullBackup): Promise<void> => {
  await Promise.all([
    saveMeasurableGoals(backup.measurableGoals),
    saveBooleanGoals(backup.booleanGoals),
    saveBucketList(backup.bucketList),
    saveNotes(backup.notes),
    saveFiveYearVisions(backup.fiveYearVisions),
    ...backup.dailyEntries.map(saveDailyEntry),
    ...backup.monthlyData.map(saveMonthlyData),
    ...backup.weeklyData.map(saveWeeklyData),
  ])
}

