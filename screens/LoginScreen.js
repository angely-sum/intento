import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { colors, spacing, radius } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lengkapi data', 'Email dan password wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('Gagal masuk', mapFirebaseError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.brand}>intent<Text style={{ color: colors.accent }}>o</Text></Text>
        <Text style={styles.tagline}>Your intention. Your practice. Your progress.</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Masuk</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={submitting}>
            <Text style={styles.btnText}>{submitting ? 'Memproses...' : 'Masuk'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: spacing.md }}>
            <Text style={styles.link}>Belum punya akun? Daftar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function mapFirebaseError(e) {
  const code = e?.code || '';
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'Email atau password salah.';
  }
  if (code.includes('email-already-in-use')) return 'Email sudah terdaftar.';
  if (code.includes('weak-password')) return 'Password minimal 6 karakter.';
  if (code.includes('invalid-email')) return 'Format email tidak valid.';
  return 'Terjadi kesalahan. Coba lagi.';
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  brand: { fontSize: 40, fontWeight: '800', color: colors.ink, textAlign: 'center', letterSpacing: -1 },
  tagline: { textAlign: 'center', color: colors.muted, marginTop: 4, marginBottom: spacing.xl },
  card: {
    backgroundColor: colors.card, borderRadius: radius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.line,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: spacing.md },
  input: {
    borderWidth: 1, borderColor: colors.line, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.sm, backgroundColor: '#fbfcfa', color: colors.ink,
  },
  btn: {
    backgroundColor: colors.accent, borderRadius: radius.md, padding: spacing.md,
    alignItems: 'center', marginTop: spacing.xs,
  },
  btnText: { color: colors.white, fontWeight: '700' },
  link: { color: colors.accent, textAlign: 'center', fontWeight: '600' },
});
