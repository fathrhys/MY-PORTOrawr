---
title: "Smart Routine App"
description: "Aplikasi mobile berbasis React Native (Expo) untuk manajemen rutinitas harian dengan asisten AI pelatih produktivitas offline."
year: 2026
category: "MOBILE"
techStack: "React Native, Expo, AsyncStorage, TypeScript"
githubUrl: "https://github.com/fathrhys/SmartRoutine"
demoUrl: "-"
coverUrl: "/uploads/cover_1769276471595_900b704ba97ad.png"
createdAt: "2026-01-24T17:41:11.641Z"
updatedAt: "2026-03-10T12:00:00.000Z"
---

# SmartRoutine: Aplikasi Smart Life untuk Pelajar 📱

SmartRoutine adalah aplikasi *mobile* berbasis **React Native** (menggunakan *framework* **Expo**) yang dirancang khusus untuk membantu pelajar mengelola rutinitas harian mereka. Fokus utamanya tidak hanya pada penyelesaian tugas, melainkan pada kesehatan, kedisiplinan, etika digital, dan pengembangan karakter harian secara konsisten.

## 🚀 Fitur Unggulan

### 1. Manajemen Rutinitas Presisi
Pengguna dapat menjadwalkan rutinitas harian berdasarkan kategori penting seperti **Belajar, Olahraga, Tidur, Ibadah, dan Digital**. App memungkinkan setting jam, durasi, repetisi hari (Mon-Sun), beserta custom *notes*.

### 2. Daily Tracking & Streak System 🔥
Sistem ini menggunakan algoritma *scoring* otomatis: `(selesai / total skor) × 100%`. Semakin banyak rutinitas yang diselesaikan, skor progres harian bertambah, dilengkapi dengan perhitungan **Streak** untuk memotivasi pengguna bertindak konsisten setiap harinya.

### 3. Asisten *AI Coach* *Lokal* 🤖
Berbeda dengan asisten berbasis API eksternal, asisten **AI Coach** ini dibangun secara *offline-first*.
Sistem menganalisis data rutinitas dan progres harian secara *on-device*, kemudian mengeluarkan analisis seperti:
- **Grades (A-E)** berdasarkan capaian skor hari itu.
- **Micro-Tips**: Contohnya jika AI mendeteksi kurangnya persentase rutinitas olahraga, IA otomatis menyarankan *"Tambahkan olahraga ringan 10-20 menit 3x seminggu"*.
- **Suggested Plans**: Penyesuaian saran rutinitas hari esok berdasarkan pola keberhasilan atau kegagalan hari ini (*goal assessment: Disiplin, Sehat, atau Seimbang*).

## 🛠️ Arsitektur & Teknologi

Keseluruhan aplikasi berjalan secara independen di klien (*Client-side only*) untuk memaksimalkan privasi pengumpulan data perilaku dan kesehatan pengguna:

- **Framework**: React Native 0.81.5 + Expo SDK 54, memaksimalkan performa di Android dan iOS.
- **Routing**: `expo-router` (File-based routing layaknya Next.js untuk aplikasi mobile) yang diimplementasikan dengan *bottom tabs* yang mulus.
- **State Management**: Kombinasi `useState`, `useMemo`, `useCallback`, serta ekosistem Hook React.
- **Persistensi Data**: Implementasi murni menggunakan `@react-native-async-storage/async-storage` (`lib/storage.ts`) untuk validasi *read/write* JSON secara lokal (`Offline-first`).
- **Styling**: Memanfaatkan *pre-built UI* khusus dan parameter global tema (*light/dark otomatis ikut sistem Android/iOS*). Telkom Red (`#DC143C`) disematkan sebagai *primary color palette*.

## 🛡️ Security & Privacy Pertama

Aplikasi menerapkan sistem yang **100% Offline**. Tidak menggunakan *Cloud Sync* server sama sekali. Berarti data rutinitas, pola hidup, jam tidur pengguna, tidak dikirim ke pihak ketiga manapun. Fungsi ini sejalan dengan perlindungan data untuk perlindungan rekam privasi edukasi pengguna di bawah usia dewasa. Pengguna bisa melakukan manual ekspor *backup file* secara independen kapanpun dibutuhkan.
