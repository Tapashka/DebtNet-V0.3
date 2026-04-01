import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { COLORS } from '../../src/constants/theme';
import { useStore } from '../../src/store/useStore';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 3 }}>
      <Text style={{ fontSize: 18 }}>{emoji}</Text>
      <Text style={{ fontSize: 10, fontWeight: '600', color: focused ? COLORS.pri : COLORS.mut }}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const pending = useStore(s => s.getPendingDebts());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.bor,
          borderTopWidth: 0.5,
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Главная" focused={focused} /> }} />
      <Tabs.Screen name="balance" options={{
        tabBarIcon: ({ focused }) => (
          <View style={{ position: 'relative' }}>
            <TabIcon emoji="📊" label="Баланс" focused={focused} />
            {pending.length > 0 && (
              <View style={{ position: 'absolute', top: -4, right: -6, backgroundColor: COLORS.red, borderRadius: 7, minWidth: 14, height: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{pending.length}</Text>
              </View>
            )}
          </View>
        ),
      }} />
      <Tabs.Screen name="groups" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👥" label="Группы" focused={focused} /> }} />
      <Tabs.Screen name="contacts" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📇" label="Контакты" focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Профиль" focused={focused} /> }} />
    </Tabs>
  );
}
