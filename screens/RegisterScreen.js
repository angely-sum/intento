import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { colors, spacing, radius } from '../utils/theme';
import { mapFirebaseError } from './LoginScreen';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Lengkapi data', 'Semua kolom wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      Alert.alert('Gagal daftar', mapFirebaseError(e));
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
        <View style={styles.card}>
          <Text style={styles.title}>Buat akun</Text>
          <TextInput style={styles.input} placeholder="Nama" value={name} onChangeText={setName} />
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
            placeholder="Password (min. 6 karakter)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={submitting}>
            <Text style={styles.btnText}>{submitting ? 'Memproses...' : 'Daftar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: spacing.md }}>
            <Text style={styles.link}>Sudah punya akun? Masuk</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  brand: { fontSize: 40, fontWeight: '800', color: colors.ink, textAlign: 'center', letterSpacing: -1, marginBottom: spacing.xl },
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
