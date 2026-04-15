import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore } from '../../src/store/useStore';
import { COLORS } from '../../src/constants/theme';

export default function LoginScreen() {
  const { doLogin, isLoading, authError, clearError } = useStore();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) return;
    await doLogin(email.trim(), password);
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={s.logoWrap}>
            <View style={s.logoBox}><Text style={{ fontSize: 36 }}>💰</Text></View>
            <Text style={s.appName}>DebtNet</Text>
            <Text style={s.appSub}>Учёт долгов между друзьями</Text>
          </View>

          {/* Form */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Вход</Text>

            {authError && (
              <TouchableOpacity style={s.errBox} onPress={clearError}>
                <Text style={s.errTxt}>{authError}</Text>
              </TouchableOpacity>
            )}

            <View style={s.field}>
              <Text style={s.lbl}>Email</Text>
              <TextInput
                style={s.inp}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.mut}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={t => { setEmail(t); clearError(); }}
              />
            </View>

            <View style={s.field}>
              <Text style={s.lbl}>Пароль</Text>
              <TextInput
                style={s.inp}
                placeholder="Минимум 8 символов"
                placeholderTextColor={COLORS.mut}
                secureTextEntry
                value={password}
                onChangeText={t => { setPassword(t); clearError(); }}
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              style={[s.btn, isLoading && s.btnDim]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={s.btnTxt}>{isLoading ? 'Входим...' : 'Войти'}</Text>
            </TouchableOpacity>
          </View>

          {/* Switch to register */}
          <View style={s.switchRow}>
            <Text style={s.switchTxt}>Нет аккаунта? </Text>
            <TouchableOpacity onPress={() => { clearError(); router.replace('/(auth)/register'); }}>
              <Text style={s.switchLink}>Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: COLORS.bg },
  scroll:     { flexGrow: 1, padding: 20, justifyContent: 'center' },
  logoWrap:   { alignItems: 'center', marginBottom: 32 },
  logoBox:    { width: 72, height: 72, borderRadius: 20, backgroundColor: COLORS.pri, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  appName:    { fontSize: 28, fontWeight: '800', color: COLORS.fg },
  appSub:     { fontSize: 13, color: COLORS.mut, marginTop: 4 },
  card:       { backgroundColor: COLORS.sur, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.bor },
  cardTitle:  { fontSize: 20, fontWeight: '800', color: COLORS.fg, marginBottom: 16 },
  errBox:     { backgroundColor: 'rgba(239,68,68,.12)', borderRadius: 10, padding: 11, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(239,68,68,.3)' },
  errTxt:     { color: COLORS.red, fontSize: 13 },
  field:      { marginBottom: 12 },
  lbl:        { fontSize: 11, fontWeight: '700', color: COLORS.mut, marginBottom: 6 },
  inp:        { backgroundColor: '#fff', borderRadius: 10, padding: 12, paddingHorizontal: 14, color: '#1A1A1A', fontSize: 14 },
  btn:        { backgroundColor: COLORS.pri, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  btnDim:     { opacity: 0.6 },
  btnTxt:     { color: '#fff', fontSize: 15, fontWeight: '700' },
  switchRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchTxt:  { color: COLORS.mut, fontSize: 14 },
  switchLink: { color: COLORS.pri, fontSize: 14, fontWeight: '700' },
});
