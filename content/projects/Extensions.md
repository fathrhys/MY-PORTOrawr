---
title: "Write Up - Extensions"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "File, Zsteg, Tesseract, ImageMagick, CTF, Forensic"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769612474579_e77587b49faa1dec.png"
createdAt: "2026-01-28T14:59:43.555Z"
updatedAt: "2026-01-28T15:01:16.561Z"
---

# Write Up - Extensions

# Write Up - Extensions

  ## Info

  Challenge: Extensions
  Category: Misc
  Hint: coba perhatikan setiap huruf di flagnya jan terburu buru..

  ———

  ## Langkah 1 — Extract ZIP

  unzip extension.zip
  file file1.csv file2.go file3.sh

  Output menunjukkan ekstensi fake:

  - file1.csv → PNG
  - file2.go → PDF
  - file3.sh → GIF

  ———

  ## Langkah 2 — Part 1 dari PNG (file1.csv)

  Gunakan stego LSB dengan zsteg:

  zsteg -E b1,rgb,lsb,xy file1.csv

  Hasil:

  FGTE{steg4n0_

  ———

  ## Langkah 3 — Part 2 dari PDF (file2.go)

  PDF ternyata berisi teks tersembunyi lewat stream + ToUnicode CMap.
  Cara cepat decode:

  1. Ekstrak stream zlib & ToUnicode:

  # dari PDF stream yang berisi teks
  # (stream_05.zlib hasil ekstrak stream PDF)

  2. Mapping di ToUnicode:

  016C -> p
  016F -> r
  017C -> t
  01B0 -> x
  01EE -> _
  01CE -> 3
  01CF -> 4

  3. Decode urutan hex di stream:

  <01CE><01B0><016C><01CE><016F><017C><01EE><01CF><017C><01EE><01CE><01B0>
  → 3xp3rt_4t_3x

  Part 2:

  3xp3rt_4t_3x

  ———

  ## Langkah 4 — Part 3 dari GIF (file3.sh)

  GIF berisi teks di bagian atas, namun warnanya tricky.
  Dengan threshold/warna tertentu, hasil OCR konsisten:

  t3n510ns}

  Catatan penting sesuai hint: perhatikan tiap karakter:

  - s -> 5
  - i -> 1
  - o -> 0

  ———

  ## Flag Final

  FGTE{steg4n0_3xp3rt_4t_3xt3n510ns}

  ———

  ## Tools yang dipakai

  - file
  - zsteg
  - tesseract
  - imagemagick (untuk threshold/resize OCR)
  - pdf stream extract + ToUnicode mapping
