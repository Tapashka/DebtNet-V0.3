import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { COLORS } from '../../src/constants/theme';

export default function ContactsScreen() {
  const { contacts, addContact } = useStore();
  const [syncing, setSyncing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  function doSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  }

  function handleAdd() {
    if (!name.trim()) return;
    addContact(name.trim(), phone.trim());
    setShowAdd(false);
    setName(''); setPhone('');
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.hdr}>
        <TouchableOpacity style={s.back} onPress={() => router.push('/tabs/')}><Text style={s.backTxt}>‹</Text></TouchableOpacity>
        <View style={s.logo}><Text style={{ fontSize: 18 }}>📇</Text></View>
        <Text style={s.title}>Контакты</Text>
        <View style={s.actions}>
          <TouchableOpacity style={s.gbtn} onPress={doSync}><Text style={{ fontSize: 16 }}>🔄</Text></TouchableOpacity>
          <TouchableOpacity style={s.gbtn} onPress={() => setShowAdd(true)}><Text style={{ fontSize: 20, color: '#fff', lineHeight: 22 }}>+</Text></TouchableOpacity>
          <TouchableOpacity style={s.gbtn}><Text style={{ fontSize: 16 }}>📥</Text></TouchableOpacity>
        </View>
      </View>

      {syncing && (
        <View style={s.syncBar}><Text style={s.syncTxt}>🔄 Синхронизация...</Text></View>
      )}

      <ScrollView style={{ flex: 1, backgroundColor: '#000' }} contentContainerStyle={{ padding: 8, paddingHorizontal: 12 }}>
        {contacts.map(c => (
          <View key={c.id} style={s.cRow}>
            <View style={[s.av, { backgroundColor: c.color }]}><Text style={s.avTxt}>{c.initials}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={s.cName}>{c.name}</Text>
              <Text style={[s.cSub, { color: c.inApp ? '#888' : COLORS.amber }]}>
                {c.inApp ? (c.messenger ?? 'В приложении') : '⚠ Нет в приложении'}
              </Text>
            </View>
            {!c.inApp ? (
              <TouchableOpacity style={s.inviteBtn}><Text style={s.inviteTxt}>Пригласить</Text></TouchableOpacity>
            ) : (
              <Text style={{ color: '#ccc' }}>›</Text>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={s.modalBg}>
          <SafeAreaView style={s.modalBox}>
            <View style={s.hdr}>
              <TouchableOpacity style={s.back} onPress={() => setShowAdd(false)}><Text style={s.backTxt}>‹</Text></TouchableOpacity>
              <Text style={[s.title, { flex: 1, textAlign: 'center' }]}>Новый контакт</Text>
              <View style={{ width: 34 }} />
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <View style={s.sblk}><Text style={s.lbl}>Имя и фамилия</Text><TextInput style={s.inp} placeholder="Иван Иванов" placeholderTextColor={COLORS.mut} value={name} onChangeText={setName} /></View>
              <View style={s.sblk}><Text style={s.lbl}>Телефон</Text><TextInput style={s.inp} placeholder="+375 29 000-00-00" placeholderTextColor={COLORS.mut} keyboardType="phone-pad" value={phone} onChangeText={setPhone} /></View>
              <TouchableOpacity style={s.saveBtn} onPress={handleAdd}><Text style={s.saveTxt}>Добавить контакт</Text></TouchableOpacity>
            </ScrollView>
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
  title: { flex: 1, fontSize: 20, fontWeight: '800', color: '#fff' },
  actions: { flexDirection: 'row', gap: 7 },
  gbtn: { width: 36, height: 36, borderRadius: 9, backgroundColor: COLORS.grn, alignItems: 'center', justifyContent: 'center' },
  syncBar: { backgroundColor: COLORS.grn, padding: 8, alignItems: 'center' },
  syncTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  cRow: { backgroundColor: '#fff', borderRadius: 12, padding: 10, paddingHorizontal: 14, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 10 },
  av: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  cName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  cSub: { fontSize: 11, color: '#888' },
  inviteBtn: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: 'rgba(16,185,129,.12)', borderWidth: 1, borderColor: 'rgba(16,185,129,.3)', borderRadius: 20 },
  inviteTxt: { color: COLORS.grn, fontSize: 10, fontWeight: '700' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,.5)' },
  modalBox: { flex: 1, backgroundColor: COLORS.bg, marginTop: 60, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  sblk: { backgroundColor: COLORS.sur, borderRadius: 12, padding: 11, marginBottom: 9, borderWidth: 1, borderColor: COLORS.bor },
  lbl: { fontSize: 11, fontWeight: '700', color: '#fff', marginBottom: 8 },
  inp: { backgroundColor: '#fff', borderRadius: 10, padding: 10, paddingHorizontal: 13, color: '#1A1A1A', fontSize: 13 },
  saveBtn: { padding: 14, backgroundColor: COLORS.grn, borderRadius: 14, alignItems: 'center' },
  saveTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
