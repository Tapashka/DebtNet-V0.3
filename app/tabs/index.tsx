import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { COLORS, MONTHS } from '../../src/constants/theme';

export default function HomeScreen() {
  const { profile, debts, getIncome, getExpenses, getPendingDebts } = useStore();
  const pending = getPendingDebts();
  const recentOps = [...debts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }

  function statusBadge(status: string) {
    if (status === 'pending')   return { bg: 'rgba(251,177,71,.15)',   color: '#FBB147', text: 'Ожидает' };
    if (status === 'confirmed') return { bg: 'rgba(16,185,129,.15)',   color: '#34D399', text: 'Подтверждён' };
    return                             { bg: 'rgba(16,185,129,.2)',    color: '#10B981', text: '✓ Закрыт' };
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.hdr}>
        <View style={s.logoBox}><Text style={{ fontSize: 18 }}>💰</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.hdrTitle}>Привет, {profile.name.split(' ')[0]} 👋</Text>
          <Text style={s.hdrSub}>Твой финансовый учёт</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }}>
        {/* Dashboard */}
        <View style={s.dash}>
          <View style={s.dashRow}>
            <Text style={s.dashLabel}>Баланс</Text>
            <TouchableOpacity style={s.gearBtn} onPress={() => {}}>
              <Text style={{ color: '#fff', fontSize: 16 }}>⚙️</Text>
            </TouchableOpacity>
          </View>
          <View style={s.dashBody}>
            <View style={{ flex: 1 }}>
              <Text style={s.balanceBig}>+{getIncome()} Br</Text>
              <View style={s.curRow}><Text style={s.curLabel}>Доходы</Text><Text style={[s.curVal, { color: COLORS.emerald }]}>+{getIncome('BYN')} Br</Text></View>
              <View style={s.curRow}><Text style={s.curLabel}>Расходы</Text><Text style={[s.curVal, { color: COLORS.rose }]}>-{getExpenses('BYN')} Br</Text></View>
            </View>
            <View style={s.divider} />
            <View style={{ minWidth: 86 }}>
              <Text style={s.dashMiniLabel}>Ожидают</Text>
              <Text style={[s.dashMiniVal, { color: COLORS.amber }]}>{pending.length} зап.</Text>
            </View>
          </View>
        </View>

        {/* Pending banner */}
        {pending.length > 0 && (
          <TouchableOpacity style={s.pendingBanner} onPress={() => router.push('/tabs/balance')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={s.dot} />
              <View>
                <Text style={s.pendingTitle}>{pending.length} запроса ожидают</Text>
                <Text style={s.pendingSub}>Нажмите просмотреть</Text>
              </View>
            </View>
            <Text style={{ color: 'rgba(251,177,71,.7)' }}>›</Text>
          </TouchableOpacity>
        )}

        {/* Buttons */}
        <View style={s.btnRow}>
          <TouchableOpacity style={[s.mainBtn, { backgroundColor: COLORS.pri }]} onPress={() => router.push('/modals/entry?mode=give')}>
            <Text style={s.mainBtnTxt}>Дать</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.mainBtn, { backgroundColor: COLORS.grn }]} onPress={() => router.push('/modals/entry?mode=take')}>
            <Text style={s.mainBtnTxt}>Взять</Text>
          </TouchableOpacity>
        </View>

        {/* Operations */}
        <View style={s.opsSec}>
          <View style={s.opsHeader}>
            <Text style={s.opsTitle}>Последние операции</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/balance')}>
              <Text style={s.opsAll}>Все →</Text>
            </TouchableOpacity>
          </View>
          {recentOps.map(op => {
            const badge = statusBadge(op.status);
            return (
              <View key={op.id} style={s.opRow}>
                <View style={[s.opAv, { backgroundColor: op.contactColor }]}><Text style={s.opAvTxt}>{op.contactInitials}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={s.opName}>{op.contactName}</Text>
                  <Text style={s.opSub}>{op.comment} · {formatDate(op.createdAt)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[s.opAmt, { color: op.direction === 'give' ? COLORS.emerald : COLORS.rose }]}>
                    {op.direction === 'give' ? '+' : '-'}{op.amount} {op.currency}
                  </Text>
                  <View style={[s.badge, { backgroundColor: badge.bg }]}>
                    <Text style={[s.badgeTxt, { color: badge.color }]}>{badge.text}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  hdr: { backgroundColor: COLORS.pri, padding: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  hdrTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
  hdrSub: { fontSize: 11, color: 'rgba(255,255,255,.7)' },
  dash: { margin: 10, marginTop: 10, backgroundColor: 'rgba(255,255,255,.11)', borderWidth: 1, borderColor: 'rgba(255,255,255,.13)', borderRadius: 16, overflow: 'hidden' },
  dashRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, paddingBottom: 4 },
  dashLabel: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,.75)' },
  gearBtn: { width: 36, height: 36, borderRadius: 9, backgroundColor: COLORS.grn, alignItems: 'center', justifyContent: 'center' },
  dashBody: { flexDirection: 'row', gap: 10, padding: 12, paddingTop: 4 },
  balanceBig: { fontSize: 24, fontWeight: '800', color: COLORS.emerald, marginBottom: 8 },
  curRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  curLabel: { fontSize: 10, color: 'rgba(255,255,255,.5)' },
  curVal: { fontSize: 11, fontWeight: '700' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,.18)' },
  dashMiniLabel: { color: '#fff', fontSize: 10, fontWeight: '800' },
  dashMiniVal: { fontSize: 14, fontWeight: '800' },
  pendingBanner: { marginHorizontal: 16, marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(251,177,71,.06)', borderRadius: 12, padding: 9, paddingHorizontal: 14, borderWidth: 1, borderColor: 'rgba(251,177,71,.22)' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FBB147' },
  pendingTitle: { fontSize: 13, fontWeight: '600', color: '#FBB147' },
  pendingSub: { fontSize: 11, color: 'rgba(251,177,71,.6)' },
  btnRow: { flexDirection: 'row', gap: 8, padding: 10, paddingBottom: 0, paddingHorizontal: 16 },
  mainBtn: { flex: 1, borderRadius: 12, padding: 11, alignItems: 'center' },
  mainBtnTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  opsSec: { padding: 10, paddingHorizontal: 16 },
  opsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  opsTitle: { fontSize: 14, fontWeight: '700', color: COLORS.fg },
  opsAll: { fontSize: 12, color: COLORS.pri },
  opRow: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 9, paddingHorizontal: 10, backgroundColor: COLORS.sur, borderRadius: 10, marginBottom: 5, borderWidth: 1, borderColor: COLORS.bor },
  opAv: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  opAvTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  opName: { fontSize: 12, fontWeight: '600', color: COLORS.fg },
  opSub: { fontSize: 10, color: COLORS.mut },
  opAmt: { fontSize: 13, fontWeight: '700' },
  badge: { borderRadius: 7, paddingHorizontal: 6, paddingVertical: 1 },
  badgeTxt: { fontSize: 9, fontWeight: '600' },
});
