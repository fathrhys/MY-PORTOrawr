---
title: "Write Up - Layer Tersembunyi"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Forensic, OCR, Zsteg"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769589355613_72592364a66b8.png"
createdAt: "2026-01-28T08:32:26.175Z"
updatedAt: "2026-01-28T08:35:55.751Z"
---

# Write Up - Layer Tersembunyi

# Write Up - Layer Tersembunyi

  ## Deskripsi
  Gambar terlihat biasa, tapi pesan disembunyikan di bit-plane (LSB).

  ## File

  wget 'https://raw.githubusercontent.com/ariafatah0711/fgte_s1/refs/heads/main/04_forensics/layer_tersembunyi/cat.png'
  -O cat.png


  ## Langkah
  1) Cek file:

  file cat.png
  exiftool cat.png


  2) Cek stego:

  zsteg -a cat.png


  3) Ekstrak LSB green channel:

  zsteg -E 1b,g,lsb,xy cat.png > b1_g_lsb.raw


  4) Ubah raw jadi gambar:

  convert -size 640x800 -depth 1 gray:b1_g_lsb.raw lsb_g.png


  5) Perjelas lalu OCR:

  convert lsb_g.png -resize 400% -threshold 50% lsb_g_bw.png
  tesseract lsb_g_bw.png stdout -l eng --psm 7


  ## Flag

  FGTE{4_bit_Plane}


  ---
