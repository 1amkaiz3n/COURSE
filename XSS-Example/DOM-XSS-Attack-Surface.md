# 📌 DOM XSS Attack Surface Map (Source → Sink → Risk)

```
┌──────────────────────────────┐
│           SOURCES            │
│   (asal data user masuk)    │
└──────────────┬───────────────┘
               │
               v
```

## 📥 SOURCES (ENTRY POINT)

```
┌─────────────────────────────────────────────┐
│ location.search      → ?q=payload          │
│ location.hash        → #payload            │
│ document.URL         → full URL            │
│ document.referrer    → external page       │
│ postMessage data     → cross-origin msg    │
│ localStorage/sessionStorage               │
└─────────────────────────────────────────────┘
```

---

# 📌 SINKS (TEMPAT RAW INPUT DIEKSEKUSI)

```
┌─────────────────────────────────────────────┐
│              HIGH RISK SINKS               │
└─────────────────────────────────────────────┘
```

## ⚠️ HTML EXECUTION SINK

```
innerHTML
outerHTML
insertAdjacentHTML
document.write()
```

👉 Risk: 💥 FULL HTML PARSING → XSS

---

## ⚠️ JS EXECUTION SINK

```
eval()
setTimeout("string")
setInterval("string")
Function("string")
```

👉 Risk: 💥 DIRECT JS EXECUTION

---

## ⚠️ URL / NAVIGATION SINK

```
location = user_input
window.open(user_input)
```

👉 Risk: 🔁 REDIRECT / JS SCHEME injection

---

## ⚠️ ATTRIBUTE CONTEXT SINK

```
element.setAttribute("href", user_input)
element.src = user_input
element.innerHTML inside attribute
```

👉 Risk: ⚠️ BREAKOUT POSSIBLE

---

## ⚠️ DOM INSERTION SINK

```
appendChild()
prepend()
replaceChild()
```

👉 Risk: depends on node type (safe vs HTML injection)

---

# 📌 SINK TYPE CLASSIFICATION

```
┌──────────────────────────────────────┐
│        SINK RISK LEVELS             │
└──────────────────────────────────────┘
```

## 🔥 CRITICAL (langsung XSS)

* innerHTML
* document.write
* eval / Function
* setTimeout("string")

---

## ⚠️ HIGH (context dependent)

* outerHTML
* insertAdjacentHTML
* element.src / href
* location = input

---

## 🟡 MEDIUM (butuh kondisi)

* setAttribute()
* DOM node insertion
* template rendering engines

---

## 🟢 LOW (safe by default)

* textContent
* innerText
* value (input field only)

---

# 📌 FULL FLOW MAP (SOURCE → SINK)

```
SOURCE
  │
  ▼
location.search / hash / postMessage
  │
  ▼
SANITATION?
  │
  ├── ❌ NONE
  │       ▼
  │   SINK (innerHTML / eval / write)
  │       ▼
  │   💥 DOM XSS
  │
  └── ✅ FILTERED
          ▼
      SAFE OUTPUT (escaped text)
```

---

# 📌 QUICK DETECTION RULE (BUG BOUNTY SPEED)

```
IF source = URL / hash / message
AND sink = innerHTML / eval / write
→ HIGH PROBABILITY DOM XSS
```

---

# 📌 KEY INSIGHT (biar kamu nggak ketukar lagi)

* SOURCE = DARAH MASUK
* SINK = TEMPAT EKSEKUSI
* XSS = TERJADI KALAU DATA SAMPAI KE SINK TANPA FILTER

