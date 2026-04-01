import { View, Text, StyleSheet } from 'react-native';

interface Props {
  initials: string;
  color: string;
  size?: number;
}

export function Avatar({ initials, color, size = 40 }: Props) {
  return (
    <View style={[s.av, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[s.txt, { fontSize: size * 0.3 }]}>{initials}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  av: { alignItems: 'center', justifyContent: 'center' },
  txt: { color: '#fff', fontWeight: '700' },
});
