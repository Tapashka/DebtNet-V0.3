import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { COLORS, MONTHS } from '../../src/constants/theme';
import { Debt } from '../../src/types';

type TabKey = 'bal' | 'inc' | 'exp' | 'things' | 'pen';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'bal',    label: 'Баланс' },
  { key: 'inc',    label: 'Доходы' },
  { key: 'exp',    label: 'Расходы' },
  { key: 'things', label: 'Вещи' },
  { key: 'pen',    label: 'Ожидают' },
];

export default function BalanceScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>('bal');
  const { debts, closeDebt, confirmDebt, rejectDebt, getIncome, getExpenses } = useStore();

  const moneyDebts   = debts.filter(d => d.type === 'money' && d.status !== 'closed');
  const thingDebts   = debts.filter(d => d.type === 'thing');
  const pendingDebts = debts.filter(d => d.status === 'pending');

  function formatDate(iso: string) {
    const d = new Date(iso);
    return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  }

  function handleClose(debt: Debt) {
    Alert.alert('Закрыть долг?', `${debt.contactName} · ${debt.amount} ${debt.currency}`, [
      { text: 'Нет', style: 'cancel' },
      { text: 'Да ✓', onPress: () => closeDebt(debt.id) },
    ]);
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.hdr}>
        <TouchableOpacity style={s.back} onPress={() => router.push('/tabs/')}>
          <Text style={s.backTxt}>‹</Text>
        </TouchableOpacity>
        <View style={s.logo}><Text style={{ fontSize: 18 }}>📊</Text></View>
        <Text style={s.title}>Баланс</Text>
        <TouchableOpacity style={s.gbtn}><Text style={{ fontSize: 18 }}>📥</Text></TouchableOpacity>
      </View>

      {/* 3 dashboards */}
      <View style={s.dashRow}>
        <View style={s.dashCard}>
          <Text style={s.dashLbl}>Доходы</Text>
          <Text style={[s.dashVal, { color: COLORS.emerald }]}>+{getIncome('BYN')} Br</Text>
        </View>
        <View style={s.dashCard}>
          <Text style={s.dashLbl}>Расходы</Text>
          <Text style={[s.dashVal, { color: COLORS.rose }]}>-{getExpenses('BYN')} Br</Text>
        </View>
        <View style={s.dashCard}>
          <Text style={s.dashLbl}>Вещи</Text>
          <View style={s.dashRow2}>
            <Text style={s.dashSub}>Отдал</Text>
            <Text style={[s.dashVal, { color: COLORS.emerald }]}>3</Text>
          </View>
          <View style={s.dashRow2}>
            <Text style={s.dashSub}>Взял</Text>
            <Text style={[s.dashVal, { color: COLORS.rose }]}>2</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabBar}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[s.tab, activeTab === t.key && s.tabActive]} onPress={() => setActiveTab(t.key)}>
            <Text style={[s.tabTxt, activeTab === t.key && s.tabTxtActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14 }}>
        {/* Баланс */}
        {activeTab === 'bal' && moneyDebts.map(d => (
          <View key={d.id} style={s.card}>
            <View style={s.cardRow}>
              <View style={[s.av, { backgroundColor: d.contactColor }]}><Text style={s.avTxt}>{d.contactInitials}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{d.contactName}</Text>
                <Text style={[s.sub, { color: d.direction === 'give' ? COLORS.emerald : COLORS.rose }]}>
                  {d.direction === 'give' ? 'должен вам' : 'вы должны'} · {d.comment}
                </Text>
              </View>
              <Text style={[s.amt, { color: d.direction === 'give' ? COLORS.emerald : COLORS.rose }]}>
                {d.direction === 'give' ? '+' : '-'}{d.amount} {d.currency}
              </Text>
            </View>
            <View style={s.btns}>
              <TouchableOpacity style={s.remindBtn}><Text style={s.remindTxt}>Напомнить</Text></TouchableOpacity>
              <TouchableOpacity style={s.closeBtn} onPress={() => handleClose(d)}><Text style={s.closeTxt}>Закрыть долг</Text></TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Доходы */}
        {activeTab === 'inc' && debts.filter(d => d.direction === 'give' && d.status === 'confirmed').map(d => (
          <View key={d.id} style={[s.card, s.cardRow]}>
            <View style={[s.av, { backgroundColor: d.contactColor }]}><Text style={s.avTxt}>{d.contactInitials}</Text></View>
            <View style={{ flex: 1 }}><Text style={s.name}>{d.contactName} · {d.comment}</Text><Text style={s.sub}>{formatDate(d.createdAt)}</Text></View>
            <Text style={[s.amt, { color: COLORS.emerald }]}>+{d.amount} {d.currency}</Text>
          </View>
        ))}

        {/* Расходы */}
        {activeTab === 'exp' && debts.filter(d => d.direction === 'take' && d.status === 'confirmed').map(d => (
          <View key={d.id} style={[s.card, s.cardRow]}>
            <View style={[s.av, { backgroundColor: d.contactColor }]}><Text style={s.avTxt}>{d.contactInitials}</Text></View>
            <View style={{ flex: 1 }}><Text style={s.name}>{d.contactName} · {d.comment}</Text><Text style={s.sub}>{formatDate(d.createdAt)}</Text></View>
            <Text style={[s.amt, { color: COLORS.rose }]}>-{d.amount} {d.currency}</Text>
          </View>
        ))}

        {/* Вещи */}
        {activeTab === 'things' && thingDebts.map(d => (
          <View key={d.id} style={[s.card, s.cardRow]}>
            <View style={[s.av, { backgroundColor: d.contactColor }]}><Text style={s.avTxt}>{d.contactInitials}</Text></View>
            <View style={{ flex: 1 }}><Text style={s.name}>{d.contactName}</Text><Text style={s.sub}>{d.description}</Text></View>
            <View style={[s.badge, { backgroundColor: d.direction === 'give' ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.13)' }]}>
              <Text style={{ color: d.direction === 'give' ? COLORS.emerald : COLORS.rose, fontSize: 10 }}>{d.direction === 'give' ? 'Отдал' : 'Взял'}</Text>
            </View>
          </View>
        ))}

        {/* Ожидают */}
        {activeTab === 'pen' && pendingDebts.map(d => (
          <View key={d.id} style={s.card}>
            <View style={s.cardRow}>
              <View style={[s.av, { backgroundColor: d.contactColor }]}><Text style={s.avTxt}>{d.contactInitials}</Text></View>
              <View style={{ flex: 1 }}><Text style={s.name}>{d.contactName} · {d.comment}</Text></View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[s.amt, { color: COLORS.emerald }]}>+{d.amount} {d.currency}</Text>
                <View style={[s.badge, { backgroundColor: 'rgba(251,177,71,.15)' }]}><Text style={{ color: COLORS.amber, fontSize: 9 }}>Ожидает</Text></View>
              </View>
            </View>
            <View style={[s.btns, { borderTopWidth: 1, borderTopColor: COLORS.bor, paddingTop: 10, marginTop: 10 }]}>
              <TouchableOpacity style={[s.remindBtn, { backgroundColor: COLORS.red }]} onPress={() => rejectDebt(d.id)}>
                <Text style={s.closeTxt}>Отклонить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.closeBtn} onPress={() => confirmDebt(d.id)}>
                <Text style={s.closeTxt}>Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  hdr: { backgroundColor: COLORS.pri, padding: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  back: { width: 34, height: 34, borderRadius: 9, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  backTxt: { color: '#fff', fontSize: 22 },
  logo: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: '#fff' },
  gbtn: { width: 36, height: 36, borderRadius: 9, backgroundColor: COLORS.grn, alignItems: 'center', justifyContent: 'center' },
  dashRow: { flexDirection: 'row', gap: 8, padding: 10, paddingHorizontal: 14 },
  dashCard: { flex: 1, backgroundColor: COLORS.sur, borderRadius: 12, padding: 9, borderWidth: 1, borderColor: COLORS.bor },
  dashLbl: { fontSize: 10, fontWeight: '800', color: COLORS.fg, marginBottom: 4 },
  dashVal: { fontSize: 10, fontWeight: '700' },
  dashRow2: { flexDirection: 'row', justifyContent: 'space-between' },
  dashSub: { fontSize: 9, color: COLORS.mut },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.sur, borderBottomWidth: 0.5, borderBottomColor: COLORS.bor },
  tab: { flex: 1, alignItems: 'center', padding: 10, borderBottomWidth: 2.5, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.pri },
  tabTxt: { fontSize: 10, fontWeight: '600', color: COLORS.mut },
  tabTxtActive: { color: '#7C6EF0' },
  card: { backgroundColor: COLORS.sur, borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.bor },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  av: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  name: { fontSize: 14, fontWeight: '700', color: COLORS.fg },
  sub: { fontSize: 11, color: COLORS.mut },
  amt: { fontSize: 16, fontWeight: '800' },
  btns: { flexDirection: 'row', gap: 8, marginTop: 10 },
  remindBtn: { flex: 1, padding: 9, borderRadius: 10, backgroundColor: COLORS.pri, alignItems: 'center' },
  remindTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  closeBtn: { flex: 1, padding: 9, borderRadius: 10, backgroundColor: COLORS.grn, alignItems: 'center' },
  closeTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  badge: { borderRadius: 7, paddingHorizontal: 6, paddingVertical: 1 },
});
