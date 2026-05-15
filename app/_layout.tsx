import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'

// ─── Why we wrap in try/catch ──────────────────────────────────────────────────
// In Expo Go, the native splash screen may not be registered yet when JS loads.
// Calling preventAutoHideAsync() too early throws an error.
// The try/catch means: "attempt it, but if Expo Go isn't ready, just continue."
// In a real production build this always works and the catch never runs.
try {
  SplashScreen.preventAutoHideAsync()
} catch {
  // Safe to ignore in Expo Go
}

export default function RootLayout() {
  const [loaded] = useFonts({
    // Add custom fonts here if needed in future:
    // 'MyFont': require('../assets/fonts/MyFont.ttf'),
  })

  useEffect(() => {
    // Hide splash screen once fonts are ready
    // Also wrapped in try/catch for the same Expo Go reason
    if (loaded) {
      try {
        SplashScreen.hideAsync()
      } catch {
        // Safe to ignore in Expo Go
      }
    }
  }, [loaded])

  if (!loaded) return null

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  )
}