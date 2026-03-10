---
title: "Unauthorized New Site Skomda"
description: "Website modernisasi SMK Telkom Sidoarjo dengan fitur tes minat jurusan, portal berita, dan pendaftaran siswa berbasis React & Laravel."
year: 2025
category: "WEB"
techStack: "React, Laravel, TailwindCSS, MySQL"
githubUrl: "https://github.com/Unauthorized-new-site"
demoUrl: "-"
coverUrl: "/uploads/cover_1768748818342_3e5b719f0e5d8.png"
createdAt: "2026-01-18T10:28:29.452Z"
updatedAt: "2026-01-18T15:06:58.422Z"
---

# 🏫 Unauthorized New Site Skomda

**Unauthorized New Site Skomda** adalah sebuah inisiatif proyek pengembangan ulang (*revamp*) website resmi untuk **SMK Telkom Sidoarjo (Skomda)**. Proyek ini memisahkan arsitektur menjadi dua bagian (*Microservices-like*) yaitu Frontend dan Backend untuk meningkatkan keamanan, skalabilitas, dan pengalaman pengguna (*User Experience*).

Proyek ini dibangun secara tim dan dihosting pada organisasi GitHub [Unauthorized-new-site](https://github.com/Unauthorized-new-site), yang terdiri dari dua repositori utama: `frontend-unauthorized` dan `backend-unauthorized`.

## ⚙️ Arsitektur & Teknologi

Sistem ini mengimplementasikan pemisahan **Frontend** dan **Backend** secara total:

### 1. Frontend (React + Vite)
Frontend dibangun menggunakan **React (JSX)** dan **Vite** untuk *Hot Module Replacement* (HMR) yang super cepat. Menggunakan `react-router-dom` untuk navigasi *Single Page Application* (SPA) yang mulus tanpa *reload* halaman.

### 2. Backend (Laravel)
Menyediakan RESTful API yang tangguh menggunakan kerangka kerja PHP **Laravel**. Backend ini berfokus menangani manajemen data, autentikasi admin (`/admin/login`), serta distribusi konten dinamis seperti berita dan artikel sekolah.

## ✨ Fitur Utama Tersedia

Dari penelusuran struktur rute aplikasi, website ini menghadirkan fitur-fitur komprehensif untuk kebutuhan institusi pendidikan modern:

- **Profil Institusi Lengkap**: Menampilkan `Profil Sekolah`, `Fasilitas`, `Hubungan Industri`, hingga `Prestasi` siswa.
- **Eksplorasi Akademik**: Halaman spesifik untuk `Profil Jurusan`, `Ekstrakurikuler`, dan `Digital Talent`.
- **Sistem Berita Dinamis**: Menampilkan `Berita Terbaru` dan `Berita Populer` yang diambil langsung dari Laravel API.
- **Tes Minat Jurusan**: Fitur interaktif (`Tes Minat Jurusan`, `Kuis Minat Jurusan`, dan `Skor Pie`) untuk membantu calon siswa menemukan jurusan yang paling cocok dengan minat dan bakat mereka secara visual.
- **Direktori SDM**: Menampilkan daftar dan detail kompetensi melalui fitur `Profil Guru` dan `Profil Alumni`.
- **PPDB Online (Pendaftaran)**: Halaman `Registrasi Siswa` yang memudahkan calon peserta didik untuk mendaftar secara digital.

## 💡 Tujuan Proyek
Proyek ini bertujuan untuk menggantikan sistem legacy dengan teknologi web modern yang lebih interaktif, responsif di berbagai perangkat, dan mempermudah administrator sekolah dalam mengelola konten harian melalui API backend yang terstruktur rapi.
