import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  doc, setDoc, getDoc, updateDoc, addDoc, collection,
  query, orderBy, limit, getDocs, serverTimestamp, increment,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useAuth } from './AuthContext';
import { cancelDailyReminder, scheduleDailyReminder } from './reminders';

const DataContext = createContext(null);

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    streak: 0, score: 0, name: '',
    reminderEnabled: true, reminderHour: 19, reminderMinute: 0,
  });
  const [todayEntry, setTodayEntry] = useState(null);
  const [todayPractice, setTodayPractice] = useState(null);
  const [weekSessions, setWeekSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const snap = await getDoc(doc(db, 'users', user.uid));
    if (snap.exists()) setProfile(snap.data());
  }, [user]);

  const loadToday = useCallback(async () => {
    if (!user) return;
    const key = todayKey();
    const journalSnap = await getDoc(doc(db, 'users', user.uid, 'journalEntries', key));
    setTodayEntry(journalSnap.exists() ? journalSnap.data() : null);
    const practiceSnap = await getDoc(doc(db, 'users', user.uid, 'practiceSessions', key));
    setTodayPractice(practiceSnap.exists() ? practiceSnap.data() : null);
  }, [user]);

  const loadWeek = useCallback(async () => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'practiceSessions'),
      orderBy('createdAt', 'desc'),
      limit(7)
    );
    const snap = await getDocs(q);
    setWeekSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse());
  }, [user]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadProfile(), loadToday(), loadWeek()]);
    setLoading(false);
  }, [loadProfile, loadToday, loadWeek]);

  useEffect(() => {
    if (user) refreshAll();
    else {
      setProfile({ streak: 0, score: 0, name: '', reminderEnabled: true, reminderHour: 19, reminderMinute: 0 });
      setTodayEntry(null);
      setTodayPractice(null);
      setWeekSessions([]);
    }
  }, [user]);

  const saveJournalEntry = async ({ goal, why, action, obstacles }) => {
    if (!user) return;
    const key = todayKey();
    const isNewToday = !todayEntry;
    await setDoc(doc(db, 'users', user.uid, 'journalEntries', key), {
      goal, why, action, obstacles,
      date: key,
      createdAt: serverTimestamp(),
    });
    if (isNewToday) {
      await updateDoc(doc(db, 'users', user.uid), { streak: increment(1) });
    }
    await refreshAll();
  };

  const savePracticeSession = async ({ seconds, reflection }) => {
    if (!user) return;
    const key = todayKey();
    const minutes = Math.max(1, Math.ceil(seconds / 60));
    const scoreGain = Math.min(10, Math.round(minutes / 2) + (reflection ? 3 : 0));
    await setDoc(doc(db, 'users', user.uid, 'practiceSessions', key), {
      seconds, minutes, reflection,
      date: key,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'users', user.uid), { score: increment(scoreGain) });
    await refreshAll();
  };

  const saveReminderSettings = async ({ enabled, hour, minute }) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), {
      reminderEnabled: enabled,
      reminderHour: hour,
      reminderMinute: minute,
    });
    if (enabled) {
      await scheduleDailyReminder(hour, minute);
    } else {
      await cancelDailyReminder();
    }
    await loadProfile();
  };

  // Jumlah hari berbeda dengan sesi latihan minggu ini, dipakai sebagai proksi
  // untuk kartu "Interaction" di Home (mengikuti gaya "2 activities" di prototipe).
  const interactionCount = weekSessions.length;

  return (
    <DataContext.Provider
      value={{
        profile, todayEntry, todayPractice, weekSessions, loading, interactionCount,
        saveJournalEntry, savePracticeSession, saveReminderSettings, refreshAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
