---
title: "Write Up – Note 7"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "Acrostic, CTF, Web, HiddenPage"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769523745493_39d57143a72c8.png"
createdAt: "2026-01-27T14:22:25.611Z"
updatedAt: "2026-01-27T14:23:20.536Z"
---

# Write Up – Note 7

# Write Up – Note 7

  ## Challenge Overview
  **Category:** Web
  **Difficulty:** Easy
  **Points:** 100
  **Author:** aria

  Sebuah catatan kecil ditinggalkan dalam bentuk web sederhana. Flag dibagi menjadi **2 part**, dan disembunyikan di
  dalam pola teks serta satu halaman lain dengan nomor yang tidak biasa.

  **Target URL:** `https://note7-fgte.vercel.app`
  **Format flag:** `FGTE{...}`

  ---

  ## Given Information

  ### Target Website
  - **URL:** `https://note7-fgte.vercel.app`
  - **Clue 1:** “coba cari halaman dengan angka yang jauh lebih tinggi”
  - **Clue 2:** “satu baris menyimpan dua huruf, satu baris lainnya hanya menggunakan satu kata”

  ---

  ## Key Insights

  ### 1. Ada Halaman Lain dengan Nomor Tinggi
  Hint pertama mengarahkan ke **note dengan angka besar**.

  Akhirnya ditemukan:

  /notes/777


  Isi:

  lanjutan flagnya: Stories_Of_The_Lake_777}


  Ini jelas **part ke‑2** flag.

  ---

  ### 2. Part 1 Ada di Note 7 (Acrostic)
  Di `/notes/7`, teks di dalam blok `{ ... }` menyimpan pola huruf.

  Baris‑baris penting:

  { catatan ini kutulis dengan hati yang tenang.
  Niat sederhana menjadikannya pengingat kecil.
  oasis di tepian danau memberi ruang berpikir.
  tepi kayu tua menjadi saksi setiap coretan.
  7 lembar halaman perlahan terisi kisah singkat.
  _
  Keep selalu dalam hati hal-hal kecil yang berarti.
  Ekor burung melintas cepat, seakan menandai waktu.
  Ejaan kata menyimpan sesuatu bila kau teliti.
  Potongan cerita ini kuikat dengan sunyi.
  _
  Secret tersimpan rapat di antara baris sederhana.
  engkau harus jeli melihat awal tiap kalimat.
  catatan kecil ini memang tampak biasa.
  rasa ingin tahu adalah kunci pembuka.
  entah suatu hari nanti, mungkin kau menemukannya.
  tanda akhir kututup dengan diam yang lembut.
  _


  ---

  ## Solution Steps

  ### Step 1 – Ambil Huruf Awal Tiap Baris
  Ambil huruf awal tiap baris dalam blok `{ ... }`:


  { N o t 7 _ K E E P _ S e c r e t _


  Hasil ini membentuk:

  {Not7_KEEP_Secret_


  Namun hint mengatakan:
  - “satu baris menyimpan dua huruf” → baris **tepi** menghasilkan **“te”** sehingga membentuk **Note7** (bukan Not7)
  - “satu baris lainnya hanya menggunakan satu kata” → **Keep** dipakai sebagai satu kata utuh

  Maka hasil part 1:

  Note7_Keep_Secret_


  ---

  ### Step 2 – Gabungkan dengan Part 2
  Dari `/notes/777`:

  Stories_Of_The_Lake_777}


  ---

  ## Final Flag

  FGTE{Note7_Keep_Secret_Stories_Of_The_Lake_777}


  ---

  ## Conclusion

  Challenge ini mengajarkan:
  - **Baca hint dengan teliti**
  - **Cari halaman tersembunyi dengan nomor besar**
  - **Acrostic tidak selalu 1 huruf per baris**
  - Kadang satu baris menyimpan **dua huruf**, dan satu baris hanya satu **kata utuh**

  ---

  **Author:** [Nashwan]
  **Date:** January 27, 2026
  **Challenge:** Note 7
  **Category:** Web
