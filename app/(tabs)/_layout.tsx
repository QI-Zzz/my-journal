import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { Colors, TabColors } from '../../constants/theme'

export default function TabLayout(){
  return <Tabs screenOptions={{
    tabBarActiveTintColor: Colors.accent,
    tabBarInactiveTintColor: Colors.textMuted,
    tabBarStyle: {
      backgroundColor: Colors.background,
      borderTopColor: Colors.border,
    },
    headerShown: false,
  }}>
    <Tabs.Screen name="index" options={{ title: 'Today', tabBarActiveTintColor: TabColors.today, tabBarIcon: ({color}) => <Ionicons name="ellipse" size={16} color={color} /> }} />
    <Tabs.Screen name="weekly" options={{ title: 'Weekly', tabBarActiveTintColor: TabColors.weekly, tabBarIcon: ({color}) => <Ionicons name="ellipse" size={16} color={color} /> }} />
    <Tabs.Screen name="calendar" options={{ title: 'Calendar', tabBarActiveTintColor: TabColors.calendar, tabBarIcon: ({color}) => <Ionicons name="ellipse" size={16} color={color} /> }} />
    <Tabs.Screen name="notes" options={{ title: 'Notes', tabBarActiveTintColor: TabColors.notes, tabBarIcon: ({color}) => <Ionicons name="ellipse" size={16} color={color} /> }} />
    <Tabs.Screen name="goals" options={{ title: 'Goals', tabBarActiveTintColor: TabColors.goals, tabBarIcon: ({color}) => <Ionicons name="ellipse" size={16} color={color} /> }} />
  </Tabs>
}