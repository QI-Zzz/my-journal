// ─── Daily Entry ───────────────────────────────────────────
export type Mood = 'happy' | 'neutral but happy' | 'neutral but sad' | 'sad'

export type Weather = 'sunny' | 'cloudy' | 'rainy' | 'some sunshine' | 'special'

export type TodoItem = {
  id: string
  text: string
  done: boolean
  createdAt: string
}

export type DailyLog = {
    read: boolean
    study: boolean
    noSocialMedia: boolean
    noJunkFood: boolean
    vitamin: boolean
    piano: boolean  

    sports: ('weight training' | 'dance' | 'ballet' | 'boxing' | 'bouldering' | 'yoga' | 'running' | 'others')[]
    studylist: ('programming' | 'dutch' | 'english' | 'trading' | 'AI')[]

    cigarettes: number
    deepSleepHours: number
    sleepQuality: number    // 1-5
    energyLevel: number    // 1-5


}

export type FoodEntry = {
  id: string
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  text: string
}

export type TimeTracking = {
  sleep: number        // hours
  socialMedia: number  // hours
  study: number        // hours
  wakeUpTime?: string
  sleepTime?: string
}

export type DailyEntry = {
  date: string         // "2026-04-20"
  mood?: Mood
  weather?: Weather
  log: DailyLog 
  food: FoodEntry[]
  todos: TodoItem[]
  timeTracking: TimeTracking
  gratitude: string
  dayWord: string      // one word summary for calendar
}

// ─── Goals ─────────────────────────────────────────────────
export type GoalMeasurable = {
  id: string
  title: string
  progress: number     // 0-100
  target?: number    // e.g. "24 books"
  current?: number     // e.g. "6 books"
}

export type GoalBoolean = {
  id: string
  title: string
  done: boolean
}

export type BucketItem = {
  id: string
  text: string
  done: boolean
}

// ─── Calendar ──────────────────────────────────────────────
export type BookEntry = {
  id: string
  title: string
  done: boolean
}

export type MonthlyData = {
  month: string        // "2026-04"
  todos: TodoItem[]
  books: BookEntry[]
}

// ─── Weekly ────────────────────────────────────────────────
export type WeeklyData = {
  week: string         // "2026-W17"
  todos: TodoItem[]
}

// ─── Notes ─────────────────────────────────────────────────
export type Note = {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

// ─── 5 Year Vision ─────────────────────────────────────────
export type LifeArea = 
  'career' | 'finance' | 'health' | 'life' | 'learning' | 'experiences'

export type FiveYearVision = {
  area: LifeArea
  vision: string           // free text, your dream for this area
  goals: GoalBoolean[]     // concrete goals under this vision
}

// ─── Full Backup ────────────────────────────────────────────
export type FullBackup = {
  exportedAt: string
  version: string
  dailyEntries: DailyEntry[]
  measurableGoals: GoalMeasurable[]
  booleanGoals: GoalBoolean[]
  bucketList: BucketItem[]
  monthlyData: MonthlyData[]
  weeklyData: WeeklyData[]
  notes: Note[]
  fiveYearVisions: FiveYearVision[]
}