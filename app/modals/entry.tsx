import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { COLORS, CURRENCIES } from '../../src/constants/theme';
import { Contact, Currency, DebtDirection, DebtType } from '../../src/types';

export default function EntryModal() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const { contacts, addDebt } = useStore();

  const [direction, setDirection] = useState<DebtDirection>((mode as DebtDirection) || 'give');
  const [type, setType] = useState<DebtType>('money');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('BYN');
  const [comment, setComment] = useState('');
  const [description, setDescription] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [showPB, setShowPB] = useState(false);
  const [pbSearch, setPbSearch] = useState('');

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(pbSearch.toLowerCase()) || (c.phone ?? '').includes(pbSearch)
  );

  function submit() {
    if (!selectedContact) return;
    addDebt({
      contactId: selectedContact.id,
      contactName: selectedContact.name,
      contactInitials: selectedContact.initials,
      contactColor: selectedContact.color,
      direction,
      type,
      amount: type === 'money' ? parseFloat(amount) || 0 : undefined,
      currency: type === 'money' ? currency : undefined,
      description: type === 'thing' ? description : undefined,
      comment,
      returnDate: returnDate || undefined,
      status: 'pending',
    });
    router.back();
  }

  const ActBtn = ({ active, label, onPress }: any) => (
    <TouchableOpacity style={[s.actBtn, active && s.actBtnOn]} onPress={onPress}>
      <Text style={[s.actTxt, active && s.actTxtOn]}>{label}</Text>
    </TouchableOpacity>
  );

  if (showPB) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.hdr}>
          <TouchableOpacity style={s.back} onPress={() => setShowPB(false)}><Text style={s.backTxt}>‹</Text></TouchableOpacity>
          <Text style={s.modTitle}>Выбор контакта</Text>
          <View style={{ width: 34 }} />
        </View>
        <View style={{ padding: 12, backgroundColor: COLORS.sur, borderBottomWidth: 1, borderBottomColor: COLORS.bor }}>
          <TextInput style={s.searchInp} placeholder="🔍  Поиск по имени или номеру..." placeholderTextColor={COLORS.mut} value={pbSearch} onChangeText={setPbSearch} />
        </View>
        <ScrollView>
          {filteredContacts.map(c => (
            <TouchableOpacity key={c.id} style={s.pbRow} onPress={() => { setSelectedContact(c); setShowPB(false); }}>
              <View style={[s.avLg, { backgroundColor: c.color }]}><Text style={s.avLgTxt}>{c.initials}</Text></View>
              <View><Text style={s.pbName}>{c.name}</Text><Text style={s.pbPhone}>{c.phone}</Text></View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.hdr}>
        <TouchableOpacity style={s.closeBtn} onPress={() => router.back()}><Text style={s.closeTxt}>✕</Text></TouchableOpacity>
        <Text style={s.modTitle}>{direction === 'give' ? 'Дать в долг' : 'Взять в долг'}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 14, gap: 9 }}>
        {/* Действие */}
        <View style={s.sblk}><Text style={s.lbl}>Действие</Text>
          <View style={s.row2}>
            <ActBtn active={direction === 'give'} label="Дать в долг" onPress={() => setDirection('give')} />
            <ActBtn active={direction === 'take'} label="Взять в долг" onPress={() => setDirection('take')} />
          </View>
        </View>

        {/* Тип */}
        <View style={s.sblk}><Text style={s.lbl}>Тип</Text>
          <View style={s.row2}>
            <ActBtn active={type === 'money'} label="💳 Деньги" onPress={() => setType('money')} />
            <ActBtn active={type === 'thing'} label="📦 Вещь" onPress={() => setType('thing')} />
          </View>
        </View>

        {/* Контакт */}
        <View style={s.sblk}>
          <Text style={s.lbl}>{direction === 'give' ? 'Кому даёте' : 'У кого берёте'}</Text>
          {selectedContact ? (
            <View style={s.contactCard}>
              <View style={[s.av, { backgroundColor: selectedContact.color }]}><Text style={s.avTxt}>{selectedContact.initials}</Text></View>
              <View style={{ flex: 1 }}><Text style={s.ccName}>{selectedContact.name}</Text><Text style={s.ccPhone}>{selectedContact.phone}</Text></View>
              <TouchableOpacity style={s.clearBtn} onPress={() => setSelectedContact(null)}><Text style={s.clearTxt}>✕</Text></TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={s.pickBtn} onPress={() => setShowPB(true)}>
              <Text style={{ fontSize: 16 }}>📋</Text>
              <Text style={s.pickTxt}>Выбрать из телефонной книги</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Деньги */}
        {type === 'money' && (
          <View style={s.sblk}><Text style={s.lbl}>Сумма и комментарий</Text>
            <View style={s.amtRow}>
              <TextInput style={s.amtInp} placeholder="0" placeholderTextColor={COLORS.mut} keyboardType="numeric" value={amount} onChangeText={setAmount} />
              <View style={s.amtDivider} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.curScroll} contentContainerStyle={{ gap: 6, paddingHorizontal: 8 }}>
                {CURRENCIES.map(c => (
                  <TouchableOpacity key={c.code} style={[s.curChip, currency === c.code && s.curChipOn]} onPress={() => setCurrency(c.code as Currency)}>
                    <Text style={[s.curChipTxt, currency === c.code && { color: '#fff' }]}>{c.symbol} {c.code}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <TextInput style={[s.inp, { marginTop: 8 }]} placeholder="Комментарий (необязательно)" placeholderTextColor="#888" value={comment} onChangeText={setComment} />
          </View>
        )}

        {/* Вещь */}
        {type === 'thing' && (
          <View style={s.sblk}><Text style={s.lbl}>Описание вещи</Text>
            <TextInput style={[s.inp, { marginBottom: 8 }]} placeholder="Например: Книга «Чистый код»" placeholderTextColor="#888" value={description} onChangeText={setDescription} />
            <Text style={[s.lbl, { marginTop: 4 }]}>Дата возврата</Text>
            <TextInput style={s.inpD} placeholder="ГГГГ-ММ-ДД" placeholderTextColor={COLORS.mut} value={returnDate} onChangeText={setReturnDate} />
          </View>
        )}

        <TouchableOpacity style={s.submitBtn} onPress={submit}>
          <Text style={s.submitTxt}>Создать запись</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  hdr: { backgroundColor: COLORS.pri, padding: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 34, height: 34, borderRadius: 9, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  backTxt: { color: '#fff', fontSize: 22 },
  closeBtn: { width: 32, height: 32, borderRadius: 9, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  closeTxt: { color: '#fff', fontSize: 16 },
  modTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  sblk: { backgroundColor: COLORS.sur, borderRadius: 12, padding: 11, borderWidth: 1, borderColor: COLORS.bor },
  lbl: { fontSize: 11, fontWeight: '700', color: '#fff', marginBottom: 8 },
  row2: { flexDirection: 'row', gap: 6 },
  actBtn: { flex: 1, padding: 8, borderRadius: 10, backgroundColor: COLORS.bor, alignItems: 'center' },
  actBtnOn: { backgroundColor: COLORS.grn },
  actTxt: { fontSize: 12, fontWeight: '700', color: COLORS.mut },
  actTxtOn: { color: '#fff' },
  contactCard: { backgroundColor: COLORS.bg, borderRadius: 12, padding: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: COLORS.pri, flexDirection: 'row', alignItems: 'center', gap: 10 },
  av: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
  ccName: { fontSize: 14, fontWeight: '600', color: COLORS.fg },
  ccPhone: { fontSize: 11, color: COLORS.mut },
  clearBtn: { backgroundColor: 'rgba(239,68,68,.15)', borderRadius: 8, padding: 5, paddingHorizontal: 8 },
  clearTxt: { color: COLORS.rose, fontSize: 12 },
  pickBtn: { padding: 13, paddingHorizontal: 16, backgroundColor: COLORS.sur2, borderWidth: 1.5, borderColor: COLORS.bor, borderStyle: 'dashed', borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  pickTxt: { fontSize: 13, fontWeight: '600', color: COLORS.mut },
  amtRow: { flexDirection: 'row', borderRadius: 10, overflow: 'hidden', borderWidth: 1.5, borderColor: COLORS.bor },
  amtInp: { flex: 1, padding: 10, paddingHorizontal: 12, backgroundColor: COLORS.bg, color: COLORS.fg, fontSize: 20, fontWeight: '700' },
  amtDivider: { width: 1, backgroundColor: COLORS.bor },
  curScroll: { maxWidth: 130 },
  curChip: { paddingHorizontal: 8, paddingVertical: 6, backgroundColor: COLORS.bor, borderRadius: 8 },
  curChipOn: { backgroundColor: COLORS.pri },
  curChipTxt: { fontSize: 11, fontWeight: '700', color: COLORS.mut },
  inp: { backgroundColor: '#fff', borderRadius: 10, padding: 10, paddingHorizontal: 13, color: '#1A1A1A', fontSize: 13 },
  inpD: { backgroundColor: COLORS.bg, borderWidth: 1.5, borderColor: COLORS.bor, borderRadius: 10, padding: 10, paddingHorizontal: 13, color: COLORS.fg, fontSize: 13 },
  submitBtn: { padding: 12, backgroundColor: COLORS.grn, borderRadius: 12, alignItems: 'center' },
  submitTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  searchInp: { backgroundColor: COLORS.sur2, borderWidth: 1, borderColor: COLORS.bor, borderRadius: 12, padding: 10, paddingHorizontal: 14, color: COLORS.fg, fontSize: 14 },
  pbRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 13, paddingHorizontal: 18, borderBottomWidth: 0.5, borderBottomColor: COLORS.sur2 },
  avLg: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avLgTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  pbName: { fontSize: 15, fontWeight: '600', color: COLORS.fg },
  pbPhone: { fontSize: 12, color: COLORS.mut, marginTop: 2 },
});
