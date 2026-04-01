import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { COLORS } from '../constants/theme';

interface Props {
  title: string;
  logo: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function Header({ title, logo, showBack = true, rightElement }: Props) {
  return (
    <View style={s.hdr}>
      {showBack ? (
        <TouchableOpacity style={s.back} onPress={() => router.push('/tabs/')}>
          <Text style={s.backTxt}>‹</Text>
        </TouchableOpacity>
      ) : null}
      <View style={s.logo}><Text style={{ fontSize: 18 }}>{logo}</Text></View>
      <Text style={s.title}>{title}</Text>
      {rightElement ?? <View style={{ width: 36 }} />}
    </View>
  );
}

const s = StyleSheet.create({
  hdr: { backgroundColor: COLORS.pri, padding: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { width: 34, height: 34, borderRadius: 9, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  backTxt: { color: '#fff', fontSize: 22 },
  logo: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: '#fff' },
});
