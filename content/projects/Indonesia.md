---
title: "Write Up – Indonesia"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Steganografi, Metadata, 3Part"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769529176714_930805329a87d.png"
createdAt: "2026-01-27T15:52:56.761Z"
updatedAt: "2026-01-27T15:52:56.761Z"
---

# Write Up – Indonesia

———

  # Write Up – Indonesia

  ## Challenge Overview

  Category: Forensics
  Difficulty: Easy
  Points: 100
  Author: aria

  Foto menyembunyikan rahasia. Flag terdiri dari 3 bagian.

  File: indonesia.jpg
  Hint: binwalk, exiftool, steghide, cat

  Format flag:

  FGTE{...}

  ———

  ## Given Information

  ### Target File

  - File: indonesia.jpg
  - Jenis: JPEG
  - Hint Tools: binwalk, exiftool, steghide, cat

  ### Challenge Hint

  > binwalk, exiftool, steghide, cat

  Analisis Hint:

  - File berisi data tersembunyi (binwalk)
  - Metadata penting (exiftool)
  - Ada steganografi (steghide)
  - Ada data appended/hidden yang bisa dibaca dengan cat/hexdump

  ———

  ## Key Insights

  ### 1. Binwalk – Ada ZIP tersembunyi

  binwalk indonesia.jpg

  Hasil menunjukkan ZIP di dalam JPEG berisi:

  - flag.jpg
  - maps.jpeg

  ### 2. EXIF – Part 1 ada di comment

  exiftool _indonesia.jpg.extracted/flag.jpg

  Ditemukan:

  Comment: FGTE{you_found_me_wi

  ### 3. Steghide – Part 2 tersembunyi di flag.jpg

  Passphrase didapat dari wordlist Indonesia (hint).

  Gunakan wordlist Indonesia + stegseek (lebih cepat daripada steghide brute force):

  stegseek flag.jpg wordlist.txt --extractfile part2.txt

  Hasil:

  th_wordlist_and_steghide_hid

  ### 4. Data appended di maps.jpeg – Part 3

  Ada data setelah EOI JPEG (FF D9).

  python3 - <<'PY'
  data=open('maps.jpeg','rb').read()
  idx=data.rfind(b'\xff\xd9')
  print(data[idx+2:].decode('utf-8','ignore'))
  PY

  Hasil:

  d
  e
  n
  _
  i
  n
  _
  i
  n
  d
  o
  n
  e
  s
  i
  a
  }

  Disatukan menjadi:

  den_in_indonesia}

  ———

  ## Solution Steps

  ### Step 1 – Extract embedded files

  binwalk -e indonesia.jpg

  Hasil:

  _indonesia.jpg.extracted/flag.jpg
  _indonesia.jpg.extracted/maps.jpeg

  ### Step 2 – Ambil Part 1 dari EXIF

  exiftool _indonesia.jpg.extracted/flag.jpg

  Output:

  FGTE{you_found_me_wi

  ### Step 3 – Brute steghide Part 2

  Gunakan wordlist Indonesia (contoh dari repo geovedi).

  stegseek _indonesia.jpg.extracted/flag.jpg wordlist.txt --extractfile part2.txt
  cat part2.txt

  Output:

  th_wordlist_and_steghide_hid

  ### Step 4 – Ambil Part 3 dari tail JPEG

  python3 - <<'PY'
  data=open('_indonesia.jpg.extracted/maps.jpeg','rb').read()
  idx=data.rfind(b'\xff\xd9')
  print(data[idx+2:].decode('utf-8','ignore'))
  PY

  Output:

  den_in_indonesia}

  ———

  ## Final Flag

  Gabungkan 3 part:

  - Part 1: FGTE{you_found_me_wi
  - Part 2: th_wordlist_and_steghide_hid
  - Part 3: den_in_indonesia}

  ✅ Flag:

  FGTE{you_found_me_with_wordlist_and_steghide_hidden_in_indonesia}

  ———

  ## Tools Used

  - binwalk – extract embedded files
  - exiftool – baca metadata
  - steghide / stegseek – brute dan extract payload
  - python / cat – baca data hidden setelah EOI

  ———

  ## Conclusion

  Challenge ini menguji kombinasi teknik forensics klasik:

  - Steganografi di file ter‑extract
  - Metadata EXIF sebagai flag part
  - Data appended setelah marker JPEG (EOI)

  Key takeaway: Jangan hanya fokus pada isi gambar – metadata dan tail file sering menyimpan data penting.

  ———
