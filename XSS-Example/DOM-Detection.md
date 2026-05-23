# 📌 DOM XSS Real Lab Detection Checklist (30 Detik Scan)

```id="kq1p7z"
┌────────────────────────────────────────────┐
│ STEP 1 — IDENTIFY SOURCES (5 detik)      │
└────────────────────────────────────────────┘
```

## 🔍 Cek URL & input entry point

* ?search=
* ?q=
* ?id=
* #fragment
* postMessage listener

👉 Jika ada user-controlled input → lanjut

---

```id="8xg3qb"
┌────────────────────────────────────────────┐
│ STEP 2 — TRACE USAGE (10 detik)          │
└────────────────────────────────────────────┘
```

## 🔎 Cari penggunaan di JS

Buka DevTools → Sources / Inspect

Cari pattern ini:

* `location.search`
* `location.hash`
* `document.URL`
* `referrer`
* `postMessage`

👉 Kalau ketemu → cek sink

---

```id="t9m2kz"
┌────────────────────────────────────────────┐
│ STEP 3 — IDENTIFY SINK (10 detik)        │
└────────────────────────────────────────────┘
```

## ⚠️ HIGH RISK SINKS

Cari ini di JS:

* innerHTML
* document.write
* outerHTML
* insertAdjacentHTML
* eval / Function / setTimeout("string")

👉 Kalau SOURCE → SINK langsung = 🚨 RED FLAG

---

```id="x0v8lm"
┌────────────────────────────────────────────┐
│ STEP 4 — DOM BEHAVIOR CHECK (5 detik)    │
└────────────────────────────────────────────┘
```

## 👀 Lihat perubahan di DOM

Inject test string:

```
test123
```

Cek:

* Apakah masuk sebagai text?
* Atau berubah jadi HTML?

👉 Jika jadi HTML → potensi XSS

---

# 📌 QUICK DECISION TREE

```id="p3c8nf"
SOURCE + SINK + NO SANITIZATION
            ↓
     💥 DOM XSS LIKELY
```

---

# 📌 RED FLAGS (langsung curiga vuln)

* Input dari URL muncul di DOM
* innerHTML dipakai tanpa sanitize
* Ada event handler (onerror/onload)
* Tidak ada encodeURIComponent / DOMPurify
* HTML berubah setelah input

---

# 📌 30-SECOND MENTAL SHORTCUT

```id="v6d1qs"
IF:
URL PARAM → JS SOURCE → innerHTML / eval
THEN:
👉 STOP SEARCHING, TEST PAYLOAD
```

---

# 📌 PRO TIP (biar lebih cepat lagi)

Kalau kamu lihat:

* `location.search + innerHTML`
* `hash + insertAdjacentHTML`

👉 hampir selalu LAB DOM XSS

