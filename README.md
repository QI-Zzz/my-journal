# MyJournal 📔

A personal daily journal app built with React Native (Expo) and deployed as a PWA. Tracks mood, habits, sleep, food, goals and more — all stored locally on device.

---

## Demo


https://github.com/user-attachments/assets/ff97cca6-533b-4a1c-87af-07d3b06d7c4e


---

## Features

### Today Tab
- Daily mood & weather tracking
- Task management
- Food diary (breakfast, lunch, dinner, snack)
- Habit toggles (read, no junk food, vitamin, piano, social media)
- Exercise tracking
- Study tracking (programming, dutch, english, trading, project)
- Time tracking — wake/sleep times, social media hours, study hours
- Sleep metrics — deep sleep, sleep quality, energy level
- Gratitude journal

### Weekly Tab
- Week navigation
- Mood strip across the week
- Habit completion tracker
- Weekly highlights (avg sleep, study, social media, workouts)
- Sleep insights — 3 cards:
  - Sleep consistency & wake time variance
  - Sleep duration vs energy correlation
  - Deep sleep efficiency with daily breakdown

### Calendar Tab
- One-word-a-day calendar grid
- Mood distribution chart
- Monthly averages (sleep, social media, study) with month-over-month delta
- Habit completion counts
- Food rankings — all foods logged this month, ranked by frequency, separated by meal type

### Goals Tab
- Measurable goals with progress bars
- Boolean goals (done/not done)
- Bucket list

### Year Tab
- Heat map — mood, study, exercise views across all 12 months
- Year summary (study days, exercise days)
- Gratitude journal — all entries grouped by month, collapsible

---

## Tech Stack

```
React Native + Expo (SDK 54)
Expo Router (file-based navigation)
AsyncStorage (local data, persists on device)
TypeScript
PWA (deployed via Vercel)
```

---

## Project Structure

```
app/
  (tabs)/
    index.tsx        ← Today
    weekly.tsx       ← Weekly
    calendar.tsx     ← Calendar
    goals.tsx        ← Goals
    year.tsx         ← Year
    _layout.tsx      ← Tab bar config

hooks/
  useJournalData.ts  ← Shared data loading
  useTodayScreen.ts
  useWeeklyScreen.ts ← Includes sleep insights calculations
  useCalendarScreen.ts
  useGoalsScreen.ts
  useYearScreen.ts

storage/
  storage.ts         ← All AsyncStorage read/write + backup export/import

components/
  SettingsModal.tsx  ← Backup export/import/clear + web file picker fix
  TrackedNumberInput.tsx ← Number input with hours/minutes mode

styles/              ← One StyleSheet file per screen
types/
  index.ts           ← All TypeScript types
```

---

## Development

```bash
# Install dependencies
npm install

# Start Expo (Expo Go on phone)
npx expo start

# Build PWA
npx expo export --platform web

# Deploy to Vercel
vercel dist --prod
```

---

## Backup & Restore

### Export
Settings (⚙️) → Export backup → Save to iCloud Drive

### Restore
Settings (⚙️) → Restore backup → Pick JSON from iCloud Drive

### Backup format
```json
{
  "exportedAt": "2026-05-20T...",
  "version": "1.0.0",
  "dailyEntries": [...],
  "measurableGoals": [...],
  "booleanGoals": [...],
  "bucketList": [...],
  "monthlyData": [...],
  "weeklyData": [...],
  "notes": [...],
  "fiveYearVisions": [...]
}
```

The JSON format is stable and portable — backups work across PWA, Expo Go, and any future native build.

---

## Live App

🌐 [myjournal-ruddy.vercel.app](https://myjournal-ruddy.vercel.app)

---

## License

Personal use only.
