import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { COLORS, CURRENCIES } from '../../src/constants/theme';
import { Currency } from '../../src/types';

type SubScreen = null | 'edit' | 'premium' | 'currency' | 'ref' | 'remind' | 'history' | 'about';

export default function ProfileScreen() {
  const { profile, debts, updateProfile } = useStore();
  const [sub, setSub] = useState<SubScreen>(null);
  const [editName, setEditName] = useState('');
  const [editUname, setEditUname] = useState('');
  const [editPhone, setEditPhone] = useState('');

  function openEdit() {
    setEditName(profile.name);
    setEditUname(profile.username);
    setEditPhone(profile.phone);
    setSub('edit');
  }

  function saveProfile() {
    updateProfile({ name: editName || profile.name, username: editUname || profile.username, phone: editPhone || profile.phone });
    setSub(null);
  }

  const Row = ({ icon, bg, label, right, onPress }: any) => (
    <TouchableOpacity style={s.mrow} onPress={onPress}>
      <View style={[s.mico, { backgroundColor: bg }]}><Text style={{ fontSize: 15 }}>{icon}</Text></View>
      <Text style={s.mlabel}>{label}</Text>
      {right && <Text style={s.mright}>{right}</Text>}
      <Text style={s.marrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView>
        {/* Header */}
        <View style={s.hdr}>
          <TouchableOpacity style={s.back} onPress={() => router.push('/tabs/')}><Text style={s.backTxt}>‹</Text></TouchableOpacity>
          <View style={s.logo}><Text style={{ fontSize: 18 }}>👤</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.profName}>{profile.name}</Text>
            <Text style={s.profUname}>{profile.username}</Text>
            {profile.isPremium && (
              <TouchableOpacity onPress={() => setSub('premium')} style={s.premBadge}>
                <Text style={{ color: '#FFD700', fontSize: 11 }}>★</Text>
                <Text style={s.premTxt}>Premium</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={s.stats}>
          <TouchableOpacity style={s.statBox} onPress={() => setSub('history')}>
            <Text style={s.statNum}>{debts.length}</Text><Text style={s.statLbl}>Операций</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.statBox} onPress={() => setSub('ref')}>
            <Text style={s.statNum}>7</Text><Text style={s.statLbl}>Рефералов</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.statBox} onPress={() => setSub('premium')}>
            <Text style={[s.statNum, { color: '#FFD700' }]}>★</Text><Text style={s.statLbl}>Premium</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.sec}>Аккаунт</Text>
        <View style={{ paddingHorizontal: 12 }}>
          <Row icon="✎" bg="#EEF0FF" label="Редактировать профиль" onPress={openEdit} />
          <Row icon="⭐" bg="#FFF8E0" label="Premium подписка" right={<Text style={{ color: COLORS.grn, fontSize: 12, fontWeight: '600' }}>Активна</Text>} onPress={() => setSub('premium')} />
          <Row icon="💱" bg="#E8FFF0" label="Валюта по умолчанию" right={<Text style={{ color: '#888', fontSize: 12 }}>{profile.defaultCurrency}</Text>} onPress={() => setSub('currency')} />
          <Row icon="👥" bg="#EEF0FF" label="Реферальная программа" right={<Text style={{ color: '#888', fontSize: 12 }}>7 чел.</Text>} onPress={() => setSub('ref')} />
        </View>

        <Text style={s.sec}>Приложение</Text>
        <View style={{ paddingHorizontal: 12, paddingBottom: 24 }}>
          <Row icon="🔔" bg="#FFF8E0" label="Напоминания о долгах" right={<Text style={{ color: COLORS.grn, fontSize: 12, fontWeight: '600' }}>Вкл.</Text>} onPress={() => setSub('remind')} />
          <Row icon="↗" bg="#E8F5FF" label="Поделиться приложением" onPress={() => {}} />
          <Row icon="ℹ" bg="#F5F5F5" label="О приложении" right={<Text style={{ color: '#888', fontSize: 12 }}>v1.0.0</Text>} onPress={() => setSub('about')} />
        </View>
      </ScrollView>

      {/* ── SUB-SCREENS as Modal ── */}
      <Modal visible={sub !== null} animationType="slide" transparent>
        <View style={s.modalBg}>
          <SafeAreaView style={s.modalBox}>

            {/* Edit */}
            {sub === 'edit' && <>
              <View style={s.hdr}><TouchableOpacity style={s.back} onPress={() => setSub(null)}><Text style={s.backTxt}>‹</Text></TouchableOpacity><Text style={s.modTitle}>Редактировать профиль</Text><View style={{ width: 34 }} /></View>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={s.sblk}><Text style={s.lbl}>Имя и фамилия</Text><TextInput style={s.inp} value={editName} onChangeText={setEditName} placeholder="Имя Фамилия" placeholderTextColor={COLORS.mut} /></View>
                <View style={s.sblk}><Text style={s.lbl}>Юзернейм</Text><TextInput style={s.inp} value={editUname} onChangeText={setEditUname} placeholder="@username" placeholderTextColor={COLORS.mut} /></View>
                <View style={s.sblk}><Text style={s.lbl}>Телефон</Text><TextInput style={s.inp} value={editPhone} onChangeText={setEditPhone} placeholder="+375 29 000-00-00" placeholderTextColor={COLORS.mut} keyboardType="phone-pad" /></View>
                <TouchableOpacity style={s.saveBtn} onPress={saveProfile}><Text style={s.saveTxt}>Сохранить</Text></TouchableOpacity>
              </ScrollView>
            </>}

            {/* Premium */}
            {sub === 'premium' && <>
              <View style={s.hdr}><TouchableOpacity style={s.back} onPress={() => setSub(null)}><Text style={s.backTxt}>‹</Text></TouchableOpacity><Text style={s.modTitle}>Premium</Text><View style={{ width: 34 }} /></View>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={{ alignItems: 'center', padding: 20, marginBottom: 16 }}>
                  <Text style={{ fontSize: 48 }}>⭐</Text>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.fg, marginTop: 8 }}>DebtNet Premium</Text>
                  <Text style={{ fontSize: 13, color: COLORS.mut, marginTop: 4 }}>Разблокируй все возможности</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                  <TouchableOpacity style={[s.planCard, { borderColor: COLORS.bor }]}><Text style={s.planPeriod}>1 месяц</Text><Text style={s.planPrice}>1 $</Text></TouchableOpacity>
                  <TouchableOpacity style={[s.planCard, { borderColor: COLORS.pri }]}><Text style={[s.planPeriod, { color: COLORS.pri }]}>1 год</Text><Text style={[s.planPrice, { color: COLORS.pri }]}>10 $</Text></TouchableOpacity>
                </View>
                {['🔓 Дата возврата', '📑 Экспорт в PDF', '🔔 Умные пуши', '🌍 Все валюты + крипто'].map(f => (
                  <View key={f} style={s.featureRow}><Text style={s.featureTxt}>{f}</Text></View>
                ))}
                <TouchableOpacity style={[s.saveBtn, { marginTop: 16 }]}><Text style={s.saveTxt}>⭐ Оформить Premium — 10 $</Text></TouchableOpacity>
              </ScrollView>
            </>}

            {/* Currency */}
            {sub === 'currency' && <>
              <View style={s.hdr}><TouchableOpacity style={s.back} onPress={() => setSub(null)}><Text style={s.backTxt}>‹</Text></TouchableOpacity><Text style={s.modTitle}>Валюта</Text><View style={{ width: 34 }} /></View>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                {CURRENCIES.map(c => {
                  const on = profile.defaultCurrency === c.code;
                  return (
                    <TouchableOpacity key={c.code} style={[s.curRow2, on && { borderColor: COLORS.pri }]} onPress={() => updateProfile({ defaultCurrency: c.code as Currency })}>
                      <View style={[s.curSym, { backgroundColor: on ? 'rgba(91,79,232,.2)' : COLORS.bor }]}><Text style={[{ fontSize: 14, fontWeight: '800' }, { color: on ? '#7C6EF0' : COLORS.mut }]}>{c.symbol}</Text></View>
                      <View style={{ flex: 1, marginLeft: 12 }}><Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.fg }}>{c.code}</Text><Text style={{ fontSize: 12, color: COLORS.mut }}>{c.name}</Text></View>
                      {on && <Text style={{ color: COLORS.pri, fontSize: 20, fontWeight: '700' }}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>}

            {/* Ref */}
            {sub === 'ref' && <>
              <View style={s.hdr}><TouchableOpacity style={s.back} onPress={() => setSub(null)}><Text style={s.backTxt}>‹</Text></TouchableOpacity><Text style={s.modTitle}>Реферальная программа</Text><View style={{ width: 34 }} /></View>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={[s.sblk, { alignItems: 'center' }]}><Text style={{ fontSize: 36, fontWeight: '800', color: COLORS.pri }}>7</Text><Text style={{ color: COLORS.mut, marginTop: 4 }}>приглашённых друзей</Text></View>
                <View style={s.sblk}><Text style={{ fontSize: 12, color: COLORS.mut, marginBottom: 8 }}>Ваша ссылка</Text><View style={{ flexDirection: 'row', gap: 8 }}><View style={{ flex: 1, backgroundColor: COLORS.bg, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: COLORS.bor }}><Text style={{ color: COLORS.fg, fontSize: 12 }}>debtnet.app/ref/alex7</Text></View><TouchableOpacity style={{ padding: 10, backgroundColor: COLORS.pri, borderRadius: 10 }}><Text style={{ color: '#fff', fontWeight: '700' }}>Копировать</Text></TouchableOpacity></View></View>
              </ScrollView>
            </>}

            {/* History */}
            {sub === 'history' && <>
              <View style={s.hdr}><TouchableOpacity style={s.back} onPress={() => setSub(null)}><Text style={s.backTxt}>‹</Text></TouchableOpacity><Text style={s.modTitle}>История операций</Text><View style={{ width: 34 }} /></View>
              <ScrollView contentContainerStyle={{ padding: 14 }}>
                {debts.map(d => (
                  <View key={d.id} style={[s.opRow]}>
                    <View style={[s.avSm, { backgroundColor: d.contactColor }]}><Text style={s.avSmTxt}>{d.contactInitials}</Text></View>
                    <View style={{ flex: 1 }}><Text style={s.opName}>{d.contactName}</Text><Text style={s.opSub}>{d.comment} · {d.createdAt}</Text></View>
                    <Text style={[s.opAmt, { color: d.direction === 'give' ? COLORS.emerald : COLORS.rose }]}>{d.direction === 'give' ? '+' : '-'}{d.amount} {d.currency}</Text>
                  </View>
                ))}
              </ScrollView>
            </>}

            {/* Remind */}
            {sub === 'remind' && <>
              <View style={s.hdr}><TouchableOpacity style={s.back} onPress={() => setSub(null)}><Text style={s.backTxt}>‹</Text></TouchableOpacity><Text style={s.modTitle}>Напоминания</Text><View style={{ width: 34 }} /></View>
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={s.sblk}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: COLORS.fg, fontSize: 14, fontWeight: '600' }}>Push-уведомления</Text>
                    <Switch value={profile.pushEnabled} onValueChange={v => updateProfile({ pushEnabled: v })} trackColor={{ true: COLORS.grn, false: COLORS.bor }} />
                  </View>
                </View>
                <TouchableOpacity style={s.saveBtn} onPress={() => setSub(null)}><Text style={s.saveTxt}>Сохранить</Text></TouchableOpacity>
              </ScrollView>
            </>}

            {/* About */}
            {sub === 'about' && <>
              <View style={s.hdr}><TouchableOpacity style={s.back} onPress={() => setSub(null)}><Text style={s.backTxt}>‹</Text></TouchableOpacity><Text style={s.modTitle}>О приложении</Text><View style={{ width: 34 }} /></View>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: COLORS.pri, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Text style={{ fontSize: 36 }}>💰</Text></View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.fg }}>DebtNet</Text>
                <Text style={{ fontSize: 13, color: COLORS.mut, marginTop: 8 }}>Версия 1.0.0</Text>
                <Text style={{ fontSize: 12, color: COLORS.mut, marginTop: 4 }}>© 2026 DebtNet</Text>
              </View>
            </>}

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
  profName: { fontSize: 17, fontWeight: '800', color: '#fff' },
  profUname: { fontSize: 12, color: 'rgba(255,255,255,.65)' },
  premBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,.25)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, marginTop: 5, alignSelf: 'flex-start' },
  premTxt: { fontSize: 11, fontWeight: '600', color: '#FFD700' },
  stats: { flexDirection: 'row', gap: 8, padding: 10, paddingHorizontal: 12 },
  statBox: { flex: 1, backgroundColor: COLORS.sur, borderRadius: 10, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: COLORS.bor },
  statNum: { fontSize: 18, fontWeight: '800', color: COLORS.fg },
  statLbl: { fontSize: 10, color: COLORS.mut },
  sec: { fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.8, paddingHorizontal: 12, marginTop: 10, marginBottom: 6 },
  mrow: { backgroundColor: '#fff', borderRadius: 10, padding: 11, paddingHorizontal: 12, marginBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 10 },
  mico: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  mlabel: { flex: 1, fontSize: 13, color: '#1A1A1A' },
  mright: { fontSize: 12, color: '#888', marginRight: 4 },
  marrow: { color: '#ccc' },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,.5)' },
  modalBox: { flex: 1, backgroundColor: COLORS.bg, marginTop: 60, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  modTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '700', color: '#fff' },
  sblk: { backgroundColor: COLORS.sur, borderRadius: 12, padding: 11, marginBottom: 9, borderWidth: 1, borderColor: COLORS.bor },
  lbl: { fontSize: 11, fontWeight: '700', color: '#fff', marginBottom: 8 },
  inp: { backgroundColor: '#fff', borderRadius: 10, padding: 10, paddingHorizontal: 13, color: '#1A1A1A', fontSize: 13 },
  saveBtn: { padding: 14, backgroundColor: COLORS.grn, borderRadius: 14, alignItems: 'center' },
  saveTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  planCard: { flex: 1, backgroundColor: COLORS.sur, borderRadius: 12, padding: 12, borderWidth: 2, alignItems: 'center' },
  planPeriod: { fontSize: 12, color: COLORS.mut, marginBottom: 4 },
  planPrice: { fontSize: 22, fontWeight: '800', color: COLORS.fg },
  featureRow: { backgroundColor: COLORS.sur, borderRadius: 10, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: COLORS.bor },
  featureTxt: { fontSize: 13, color: COLORS.fg },
  curRow2: { backgroundColor: COLORS.sur, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: COLORS.bor, flexDirection: 'row', alignItems: 'center' },
  curSym: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  opRow: { backgroundColor: COLORS.sur, borderRadius: 14, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.bor, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avSm: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avSmTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  opName: { fontSize: 12, fontWeight: '600', color: COLORS.fg },
  opSub: { fontSize: 10, color: COLORS.mut },
  opAmt: { fontSize: 13, fontWeight: '700' },
});
