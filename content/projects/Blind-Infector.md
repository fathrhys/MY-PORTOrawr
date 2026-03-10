---
title: "Write Up – Blind Infector"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "Forensic, CTF, CRC-IDAT"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769576284233_7490196df6834.png"
createdAt: "2026-01-28T04:58:04.277Z"
updatedAt: "2026-01-28T04:58:04.277Z"
---

# Write Up – Blind Infector

# Write Up – Blind Infector

  ## Challenge Overview

  Category: Forensics
  Difficulty: Insane
  Points: 425
  Author: aria

  Sebuah file PNG “terinfeksi” oleh sisipan data berulang tanpa merusak header. Akibatnya ukuran file membesar dan CRC
  chunk rusak. Tugasnya: pulihkan PNG agar bisa dibuka normal, lalu baca flag yang tertulis di dalam gambar (ada gambar
  kucing + teks flag).

  Format flag:

  ASTROXNFSCC{...}

  ———

  ## Given Information

  ### File Artifact

  - File: infected.shredded
  - Type: PNG image, namun CRC chunk rusak
  - Gejala: ukuran membesar, ada sisipan byte “blind” berulang

  ### Challenge Hint Analysis

  - Struktur PNG masih valid → berarti sisipan hanya “menyusup” ke data
  - Sisipan muncul berulang → kemungkinan string/marker yang bisa dihapus

  ———

  ## Key Insights

  ### 1. PNG Masih Valid, CRC Rusak

  file masih mendeteksi PNG → header benar.
  CRC error pada chunk IDAT menunjukkan data terkontaminasi, bukan formatnya.

  ### 2. Sisipan “blind”

  Pencarian string di file menunjukkan pola blind tersebar di banyak lokasi.
  Ini indikasi data disuntikkan tanpa merusak struktur chunk utama.

  ### 3. Perbaikan = Hapus Sisipan

  Jika kita hapus semua blind, stream IDAT kembali valid → PNG pulih.

  ———

  ## Solution Steps

  ### Step 1 – Identifikasi File

  file infected.shredded

  ### Step 2 – Verifikasi Struktur PNG

  Cek CRC chunk dengan script sederhana → CRC mismatch setelah IDAT pertama.

  ### Step 3 – Temukan Sisipan

  Cari pola string blind di seluruh file → ditemukan berulang.

  ### Step 4 – Bersihkan Sisipan (Fix)

  Gunakan Python untuk menghapus semua blind:

  from pathlib import Path

  data = Path("infected.shredded").read_bytes()
  clean = data.replace(b"blind", b"")
  Path("cleaned1.png").write_bytes(clean)

  ### Step 5 – Verifikasi Hasil

  file cleaned1.png

  Hasil: PNG kembali valid dan bisa dibuka normal.

  ### Step 6 – Ambil Flag

  Di gambar hasil pemulihan terlihat tulisan flag:

  ASTROXNFSCC{bl1nd_c4t_n4m3_baka!!!!!!!!}

  ———

  ## Flag

  ASTROXNFSCC{bl1nd_c4t_n4m3_baka!!!!!!!!}

  ———

  ## Summary

  Inti challenge ini adalah menghapus sisipan byte blind yang merusak CRC IDAT. Setelah dibersihkan, PNG normal kembali
  dan flag bisa dibaca langsung dari gambar.

  ———
