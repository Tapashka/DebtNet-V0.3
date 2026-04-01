import { View, Text, StyleSheet } from 'react-native';

type Status = 'pending' | 'confirmed' | 'closed';

const CONFIG = {
  pending:   { bg: 'rgba(251,177,71,.15)',  color: '#FBB147', label: 'Ожидает' },
  confirmed: { bg: 'rgba(16,185,129,.15)',  color: '#34D399', label: 'Подтверждён' },
  closed:    { bg: 'rgba(16,185,129,.2)',   color: '#10B981', label: '✓ Закрыт' },
};

export function Badge({ status }: { status: Status }) {
  const c = CONFIG[status];
  return (
    <View style={[s.badge, { backgroundColor: c.bg }]}>
      <Text style={[s.txt, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { borderRadius: 7, paddingHorizontal: 7, paddingVertical: 1 },
  txt: { fontSize: 9, fontWeight: '600' },
});
