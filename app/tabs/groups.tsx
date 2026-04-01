import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { COLORS } from '../../src/constants/theme';
import { Currency } from '../../src/types';

const CURRENCIES: Currency[] = ['BYN', 'USD', 'EUR', 'USDT', 'BTC'];

export default function GroupsScreen() {
  const { groups, contacts, addGroup } = useStore();
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<Currency>('BYN');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  function toggleMember(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleCreate() {
    if (!name.trim() || selected.length === 0) return;
    addGroup(name.trim(), '🏷️', currency, selected);
    setShowNew(false);
    setName(''); setSearch(''); setSelected([]);
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.hdr}>
        <TouchableOpacity style={s.back} onPress={() => router.push('/tabs/')}><Text style={s.backTxt}>‹</Text></TouchableOpacity>
        <View style={s.logo}><Text style={{ fontSize: 18 }}>👥</Text></View>
        <Text style={s.title}>Группы</Text>
        <TouchableOpacity style={s.gbtn} onPress={() => setShowNew(true)}>
          <Text style={{ color: '#fff', fontSize: 22, lineHeight: 24 }}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14 }}>
        {groups.map(g => (
          <View key={g.id} style={s.card}>
            <View style={s.row}>
              <View style={s.groupIcon}><Text style={{ fontSize: 20 }}>{g.emoji}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.groupName}>{g.name}</Text>
                <Text style={s.groupSub}>{g.memberIds.length} участника · {g.currency}</Text>
              </View>
              <Text style={[s.bal, { color: g.totalBalance >= 0 ? COLORS.emerald : COLORS.rose }]}>
                {g.totalBalance >= 0 ? '+' : ''}{g.totalBalance} {g.currency === 'BYN' ? 'Br' : g.currency === 'USD' ? '$' : '€'}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal: Новая группа */}
      <Modal visible={showNew} animationType="slide" transparent>
        <View style={s.modalBg}>
          <SafeAreaView style={s.modalBox}>
            <View style={s.hdr}>
              <TouchableOpacity style={s.back} onPress={() => setShowNew(false)}><Text style={s.backTxt}>‹</Text></TouchableOpacity>
              <Text style={[s.title, { flex: 1, textAlign: 'center' }]}>Новая группа</Text>
              <View style={{ width: 34 }} />
            </View>

            {/* Flex layout — no scroll */}
            <View style={s.ngBody}>
              {/* Название */}
              <View style={s.ngBlock}>
                <Text style={s.lbl}>Название группы</Text>
                <TextInput style={s.inp} placeholder="Например: Поездка в Минск" placeholderTextColor={COLORS.mut} value={name} onChangeText={setName} />
              </View>

              {/* Валюта */}
              <View style={s.ngBlock}>
                <Text style={s.lbl}>Валюта группы</Text>
                <View style={s.curRow}>
                  {CURRENCIES.map(c => (
                    <TouchableOpacity key={c} style={[s.curBtn, currency === c && s.curBtnActive]} onPress={() => setCurrency(c)}>
                      <Text style={[s.curTxt, currency === c && { color: '#fff' }]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Участники */}
              <View style={[s.ngBlock, { flex: 1 }]}>
                <Text style={s.lbl}>Участники группы</Text>
                <TextInput style={[s.inp, { marginBottom: 8 }]} placeholder="🔍  Поиск по имени..." placeholderTextColor={COLORS.mut} value={search} onChangeText={setSearch} />
                <FlatList
                  data={filtered}
                  keyExtractor={i => i.id}
                  style={{ flex: 1 }}
                  renderItem={({ item }) => {
                    const on = selected.includes(item.id);
                    return (
                      <TouchableOpacity style={[s.contactRow, on && s.contactRowActive]} onPress={() => toggleMember(item.id)}>
                        <View style={[s.avSm, { backgroundColor: item.color }]}><Text style={s.avSmTxt}>{item.initials}</Text></View>
                        <Text style={s.contactName}>{item.name}</Text>
                        <View style={[s.chk, on && s.chkActive]}>{on && <Text style={s.chkTxt}>✓</Text>}</View>
                      </TouchableOpacity>
                    );
                  }}
                />
                <Text style={s.selCnt}>Выбрано: <Text style={{ color: COLORS.pri, fontWeight: '700' }}>{selected.length}</Text></Text>
              </View>

              <TouchableOpacity style={s.createBtn} onPress={handleCreate}>
                <Text style={s.createTxt}>Создать группу</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
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
  card: { backgroundColor: COLORS.sur, borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.bor },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  groupIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: 'rgba(91,79,232,.12)', alignItems: 'center', justifyContent: 'center' },
  groupName: { fontSize: 15, fontWeight: '700', color: COLORS.fg },
  groupSub: { fontSize: 11, color: COLORS.mut },
  bal: { fontSize: 15, fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,.5)' },
  modalBox: { flex: 1, backgroundColor: COLORS.bg, marginTop: 60, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  ngBody: { flex: 1, padding: 10, paddingHorizontal: 14, gap: 8 },
  ngBlock: { backgroundColor: COLORS.sur, borderRadius: 12, padding: 11, borderWidth: 1, borderColor: COLORS.bor },
  lbl: { fontSize: 11, fontWeight: '700', color: '#fff', marginBottom: 8 },
  inp: { backgroundColor: '#fff', borderRadius: 10, padding: 10, paddingHorizontal: 13, color: '#1A1A1A', fontSize: 13 },
  curRow: { flexDirection: 'row', gap: 6 },
  curBtn: { flex: 1, padding: 7, borderRadius: 8, backgroundColor: COLORS.bor, alignItems: 'center' },
  curBtnActive: { backgroundColor: COLORS.pri },
  curTxt: { fontSize: 11, fontWeight: '700', color: COLORS.mut },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, paddingHorizontal: 12, backgroundColor: COLORS.bg, borderRadius: 12, marginBottom: 7, borderWidth: 1, borderColor: COLORS.bor },
  contactRowActive: { borderColor: COLORS.pri },
  avSm: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avSmTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  contactName: { flex: 1, fontSize: 14, color: COLORS.fg },
  chk: { width: 22, height: 22, borderRadius: 6, backgroundColor: COLORS.bor, borderWidth: 2, borderColor: COLORS.bor, alignItems: 'center', justifyContent: 'center' },
  chkActive: { backgroundColor: COLORS.pri, borderColor: COLORS.pri },
  chkTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  selCnt: { marginTop: 6, fontSize: 12, color: COLORS.mut },
  createBtn: { padding: 13, backgroundColor: COLORS.grn, borderRadius: 13, alignItems: 'center' },
  createTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
