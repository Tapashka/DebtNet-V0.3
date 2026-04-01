import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#5B4FE8" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="tabs" />
        <Stack.Screen name="modals/entry" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modals/phonebook" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modals/newgroup" options={{ presentation: 'modal' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
