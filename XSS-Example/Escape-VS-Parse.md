# Escape vs Parse di DOM XSS

## 📌 Tabel: Perbedaan Escape vs Parse dalam DOM XSS (Context Rendering Behavior)

| Context / Kondisi                                | Cara Browser Memproses Input                                | Contoh Input                   | Hasil Render                                   | Risiko                                 |
| ------------------------------------------------ | ----------------------------------------------------------- | ------------------------------ | ---------------------------------------------- | -------------------------------------- |
| **Text context (`innerText`, `textContent`)**    | Semua input dianggap teks biasa, tidak diparse sebagai HTML | `<img onerror=1>`              | Ditampilkan apa adanya: `<img onerror=1>`      | ❌ Aman (tidak dieksekusi)              |
| **HTML entity encoding (escaping)**              | Karakter spesial diubah jadi entity HTML                    | `"><script>`                   | `&gt;&lt;script&gt;`                           | ❌ Aman (ter-escape)                    |
| **innerHTML (raw parsing)**                      | Input diproses sebagai HTML DOM                             | `<b>Hello</b>`                 | Teks jadi bold                                 | ⚠️ Potensi XSS tergantung input         |
| **innerHTML + event handler**                    | HTML diparse + atribut event bisa aktif                     | `<img src=x onerror=alert(1)>` | Script jalan saat error event                  | 🔥 DOM XSS                              |
| **Attribute context (`value="..."`)**            | Input masuk ke dalam atribut HTML                           | `" onmouseover=alert(1)`       | Bisa keluar dari atribut jika tidak disanitasi | ⚠️ High risk                            |
| **URL context (`href/src/action`)**              | Diproses sebagai URL scheme                                 | `javascript:alert(1)`          | Eksekusi jika scheme tidak diblok              | 🔥 XSS via URL scheme                   |
| **Sanitizer aktif (DOMPurify / backend filter)** | Tag berbahaya dihapus / diubah                              | `<img onerror=1>`              | Di-strip atau dinonaktifkan                    | ❌ Lebih aman (tergantung implementasi) |
| **URL encoding context**                         | Karakter di-encode jadi format URL-safe                     | `>` → `%3E`                    | Tidak dieksekusi                               | ❌ Aman                                 |
| **Template rendering tanpa sanitasi**            | Data langsung masuk ke DOM template                         | `<svg onload=alert(1)>`        | Bisa dieksekusi jika raw DOM injection         | 🔥 DOM XSS                              |

---

## 📌 Tambahan penting (biar lebih “real bug bounty”)

| Sink DOM                    | Kenapa bahaya                                  |
| --------------------------- | ---------------------------------------------- |
| `innerHTML`                 | Parse HTML + bisa trigger event                |
| `outerHTML`                 | Bisa mengganti seluruh node DOM                |
| `document.write()`          | Menulis langsung ke DOM (legacy but dangerous) |
| `insertAdjacentHTML()`      | Sama seperti innerHTML tapi lebih granular     |
| `eval()` / `new Function()` | Eksekusi JS langsung (worst case)              |

---

## 📌 Inti konsep (versi cepat)

* **Escape** → input jadi teks (`<` → `&lt;`)
* **Parse** → input jadi HTML (tag aktif)
* **Execute** → event handler / JS jalan

---

## 📌 Rule cepat di lab

* `&lt; &gt;` muncul → ❌ sudah di-escape
* `<tag>` terbentuk → ⚠️ sudah diparse
* `onerror / onclick / onload` jalan → 🔥 DOM XSS aktif
* `javascript:` jalan → 🔥 URL-based XSS

