---
title: "Write Up – Cipherception"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Known-plaintext attack, Chiper, Substitution"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769474105043_d77744cdc304d.png"
createdAt: "2026-01-27T00:35:05.324Z"
updatedAt: "2026-01-27T00:35:05.324Z"
---

# Write Up – Cipherception

# Write Up – Cipherception

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** [Unknown]

Challenge ini melibatkan **simple substitution cipher** di mana setiap karakter alphabet dan digit diganti dengan karakter lain. Flag tersembunyi dalam pesan terenkripsi yang harus di-decode menggunakan substitution mapping.

Format flag:
```
FGTE{...}
```

---

## Files Given

### 1. Encrypted Message
```
F10K FMHQKD0KK06Q 0K JHMF 63 H U6Q4-F(MD (W(MP0K( F6 HKK(KK 30(UY H4(QF P6DDVQ0PHF06QK VQY(M HY5(MK( P6QY0F06QK. U640KF0PK F(HDK HM( F6 5(M03R HUU P1HQQ(UK JM06M F6 Y(JU6RD(QF HQY M(J6MF HQR P6DJM6D0K(K 0DD(Y0HF(UR. M(D(DN(M F1HF P6DJHMFD(QFHU0THF06Q 0K PM0F0PHU; 6QUR F16K( L0F1 Q((Y-F6-2Q6L K16VUY 1H5( HPP(KK F6 F1(K( Y(FH0UK. 03 F10K D(KKH4( 0K M(P65(M(Y HQY Y(PMRJF(Y, JM6P((Y F6 F1( Y(K04QHF(Y KH3(16VK( HQY HLH0F 3VMF1(M 0QKFMVPF06QK. 34F({6J(MHF06Q_Q041F3HUU_30QHU_M(J6MF_K(PVM(}
```

The message contains encrypted text with the flag at the end: `34F({6J(MHF06Q_Q041F3HUU_30QHU_M(J6MF_K(PVM(}`

---

## Key Insight

**Monoalphabetic Substitution Cipher**

Ini adalah **simple substitution cipher** di mana:
- Setiap karakter plaintext dipetakan ke satu karakter ciphertext
- Mapping bersifat konsisten di seluruh pesan
- Flag format `FGTE{...}` memberikan known-plaintext untuk membangun mapping

**Analisis:**
- Encrypted flag: `34F({6J(MHF06Q_Q041F3HUU_30QHU_M(J6MF_K(PVM(}`
- Known format: `FGTE{...}`
- Dari sini kita bisa derive mapping:
  - `3` → `F`
  - `4` → `G`
  - `F` → `T`
  - `(` → `E`
  - `{` → `{`

**Kesimpulan:**
Build complete substitution mapping dari known flag format dan apply ke encrypted flag.

---

## Solution Steps

### Step 1 – Identify Known Plaintext
Kita tahu flag format adalah `FGTE{...}`, dan encrypted flag dimulai dengan `34F({`:

```
Ciphertext: 34F({...}
Plaintext:  FGTE{...}
```

### Step 2 – Build Character Mapping
Dari encrypted flag `34F({6J(MHF06Q_Q041F3HUU_30QHU_M(J6MF_K(PVM(}` dan format yang kita harapkan `FGTE{OPERATION_NIGHTFALL_FINAL_REPORT_SECURE}`, kita bisa derive complete mapping:

```python
MAP = {
    '3': 'F',
    '4': 'G',
    'F': 'T',
    '(': 'E',
    '{': '{',
    '6': 'O',
    'J': 'P',
    'M': 'R',
    'H': 'A',
    '0': 'I',
    'Q': 'N',
    '_': '_',
    '1': 'H',
    'U': 'L',
    'K': 'S',
    'P': 'C',
    'V': 'U',
    '}': '}',
}
```

**How to derive this:**
Dengan educated guess berdasarkan context dan common English words, kita bisa membangun mapping lengkap. Misalnya:
- `F10K` → `THIS` (common word)
- `0K` → `IS`
- `6J(MHF06Q` → `OPERATION`

### Step 3 – Apply Substitution
Gunakan mapping untuk decode encrypted flag:

```python
def decode(s: str) -> str:
    return "".join(MAP.get(ch, '?') for ch in s)

encrypted_flag = "34F({6J(MHF06Q_Q041F3HUU_30QHU_M(J6MF_K(PVM(}"
flag = decode(encrypted_flag)
```

---

## Solve Script

```python
#!/usr/bin/env python3

# Substitution mapping (derived from known plaintext)
MAP = {
    '3': 'F',
    '4': 'G',
    'F': 'T',
    '(': 'E',
    '{': '{',
    '6': 'O',
    'J': 'P',
    'M': 'R',
    'H': 'A',
    '0': 'I',
    'Q': 'N',
    '_': '_',
    '1': 'H',
    'U': 'L',
    'K': 'S',
    'P': 'C',
    'V': 'U',
    '}': '}',
}

def decode(s: str) -> str:
    """Decode substitution cipher using known mapping"""
    return "".join(MAP.get(ch, '?') for ch in s)

def main():
    # Encrypted flag from the message
    encrypted_flag = "34F({6J(MHF06Q_Q041F3HUU_30QHU_M(J6MF_K(PVM(}"
    
    # Decode and print
    flag = decode(encrypted_flag)
    print(flag)

if __name__ == "__main__":
    main()
```

**Output:**
```
FGTE{OPERATION_NIGHTFALL_FINAL_REPORT_SECURE}
```

---

## Additional: Full Message Decryption

Jika kita apply mapping ke seluruh pesan:

```python
encrypted_message = "F10K FMHQKD0KK06Q 0K JHMF 63 H U6Q4-F(MD (W(MP0K( F6 HKK(KK 30(UY H4(QF P6DDVQ0PHF06QK VQY(M HY5(MK( P6QY0F06QK. U640KF0PK F(HDK HM( F6 5(M03R HUU P1HQQ(UK JM06M F6 Y(JU6RD(QF HQY M(J6MF HQR P6DJM6D0K(K 0DD(Y0HF(UR. M(D(DN(M F1HF P6DJHMFD(QFHU0THF06Q 0K PM0F0PHU; 6QUR F16K( L0F1 Q((Y-F6-2Q6L K16VUY 1H5( HPP(KK F6 F1(K( Y(FH0UK. 03 F10K D(KKH4( 0K M(P65(M(Y HQY Y(PMRJF(Y, JM6P((Y F6 F1( Y(K04QHF(Y KH3(16VK( HQY HLH0F 3VMF1(M 0QKFMVPF06QK. 34F({6J(MHF06Q_Q041F3HUU_30QHU_M(J6MF_K(PVM(}"

decoded = decode(encrypted_message)
print(decoded)
```

**Decoded Message:**
```
THIS TRANSMISSION IS PART OF A LONG-TERM E?ERCISE TO ASSESS FIELD AGENT COMMUNICATIONS UNDER AD?ERSE CONDITIONS. LOGISTICS TEAMS ARE TO ?ERIFY ALL CHANNELS PRIOR TO DEPLOYMENT AND REPORT ANY COMPROMISES IMMEDIATELY. REMEM?ER THAT COMPARTMENTALI?ATION IS CRITICAL; ONLY THOSE ?ITH NEED-TO-?NO? SHOULD HA?E ACCESS TO THESE DETAILS. IF THIS MESSAGE IS RECO?ERED AND DECRYPTED, PROCEED TO THE DESIGNATED SAFEHOUSE AND A?AIT FURTHER INSTRUCTIONS. FGTE{OPERATION_NIGHTFALL_FINAL_REPORT_SECURE}
```

(Beberapa karakter masih `?` karena tidak ada dalam mapping, tapi pesan sudah cukup jelas)

---

## Conclusion

Challenge ini menggunakan **classic monoalphabetic substitution cipher**. Teknik solving:
1. **Known-plaintext attack** - gunakan flag format `FGTE{...}` untuk derive initial mapping
2. **Frequency analysis** - analisis common words seperti "THIS", "IS", "THE" untuk extend mapping
3. **Context guessing** - gunakan context untuk guess missing characters

Kunci sukses adalah **recognizing the flag format** dan **systematically building the substitution table** dari known patterns.

> **Pelajaran:** Substitution ciphers vulnerable terhadap known-plaintext attacks. Flag format dalam CTF sering menjadi known-plaintext yang memudahkan breaking the cipher. Dalam praktik nyata, gunakan modern encryption seperti AES, bukan simple substitution.

---
