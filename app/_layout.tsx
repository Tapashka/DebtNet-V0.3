import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useStore } from '../src/store/useStore';
import '../global.css';

export default function RootLayout() {
  const { isAuthed, init } = useStore();

  useEffect(() => {
    // On app start: try to restore session from AsyncStorage
    init().then(() => {
      // After init, route based on auth state
      const authed = useStore.getState().isAuthed;
      if (authed) {
        router.replace('/tabs');
      } else {
        router.replace('/(auth)/login');
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#5B4FE8" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)"    options={{ animation: 'fade' }} />
        <Stack.Screen name="tabs"      options={{ animation: 'fade' }} />
        <Stack.Screen name="modals/entry"     options={{ presentation: 'modal' }} />
        <Stack.Screen name="modals/phonebook" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modals/newgroup"  options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
