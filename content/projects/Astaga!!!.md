---
title: "Write Up - Astaga !!!"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "Tshark, CTF, Forensic"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769589465024_a0e363e7d2155.png"
createdAt: "2026-01-28T08:37:45.073Z"
updatedAt: "2026-01-28T08:37:45.073Z"
---

# Write Up - Astaga !!!

# Write Up - Astaga !!!

  ## Deskripsi
  Keke (admin) tidak bisa login karena ada celah edit profile yang memungkinkan username diubah.

  ## File

  wget 'https://raw.githubusercontent.com/ariafatah0711/fgte_s1/refs/heads/main/04_forensics/Astaga_!!!/Mistakez.pcap'
  -O Mistakez.pcap


  ## Langkah
  1) Lihat request HTTP penting:

  tshark -r Mistakez.pcap -Y http.request -T fields \
  -e frame.number -e ip.src -e http.request.method -e http.request.uri


  2) Fokus ke EditProfile:

  tshark -r Mistakez.pcap -Y "http.request.method=="POST" && http.request.uri contains "EditProfile.php"" \
  -T fields -e http.cookie -e http.file_data
  3) Decode payload hex:

  python - <<'PY'
  import binascii
  PY


  Dari payload terlihat beberapa perubahan profil, salah satunya mengganti username menjadi `admin` dan password
  `hayooadmin` oleh akun **InfokanCaraMembantaiETS**.

  ## Flag

  FGTE{InfokanCaraMembantaiETS}
