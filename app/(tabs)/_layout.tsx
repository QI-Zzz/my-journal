import { Tabs } from 'expo-router'
import { Platform } from 'react-native'
import { Colors, TabColors } from '../../constants/theme'

// ─── Why we use emoji instead of View on web ──────────────────────────────────
// React Native's <View> inside tabBarIcon doesn't render correctly on web —
// it shows as an empty square. Emoji renders perfectly everywhere with
// zero dependencies. On native we still use emoji too for consistency.

const makeIcon = (emoji: string) =>
  ({ focused }: { focused: boolean }) => (
    <span style={{ fontSize: 16, opacity: focused ? 1 : 0.4 }}>{emoji}</span>
  )

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          // paddingBottom fixes the tab bar being cut off by Safari's
          // home indicator bar at the bottom of the screen
          paddingBottom: Platform.OS === 'web' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'web' ? 80 : 60,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarActiveTintColor: TabColors.today,
          tabBarIcon: makeIcon('🌤️'),
        }}
      />
      <Tabs.Screen
        name="weekly"
        options={{
          title: 'Weekly',
          tabBarActiveTintColor: TabColors.weekly,
          tabBarIcon: makeIcon('📋'),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarActiveTintColor: TabColors.calendar,
          tabBarIcon: makeIcon('📅'),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Notes',
          tabBarActiveTintColor: TabColors.notes,
          tabBarIcon: makeIcon('📝'),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Goals',
          tabBarActiveTintColor: TabColors.goals,
          tabBarIcon: makeIcon('🎯'),
        }}
      />
      <Tabs.Screen
        name="year"
        options={{
          title: 'Year',
          tabBarActiveTintColor: TabColors.year,
          tabBarIcon: makeIcon('🗓️'),
        }}
      />
    </Tabs>
  )
}