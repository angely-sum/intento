import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ======================================================================
// PENTING: Ganti nilai-nilai di bawah ini dengan kredensial project
// Firebase kamu sendiri. Cara mendapatkannya ada di README.md
// (Firebase Console > Project Settings > General > Your apps > SDK config)
// ======================================================================
const firebaseConfig = {
  apiKey: 'GANTI_DENGAN_API_KEY_KAMU',
  authDomain: 'GANTI_DENGAN_PROJECT_ID.firebaseapp.com',
  projectId: 'GANTI_DENGAN_PROJECT_ID',
  storageBucket: 'GANTI_DENGAN_PROJECT_ID.appspot.com',
  messagingSenderId: 'GANTI_DENGAN_SENDER_ID',
  appId: 'GANTI_DENGAN_APP_ID',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export default app;
