# Three Strategy for Hunting for Client-Side Injection

Untuk memburu atau hunting kerentanan Client-side Inijection,kita akan menggunakan 3 strategi berbeda.

## 1. Reflected Input in Unauthenticated Routes / Input yang direfleksikan pada endpoint/rute yang tidak memerlukan autentikasi

Kita perlu menemukan program yang memiliki banyak subdomain, sehingga kita punya lebih banyak target untuk diuji.

Tujuan dari strategi pertama ini adalah memanfaatkan rute/endpoint yang tidak memerlukan autentikasi. Fokusnya adalah mencari subdomain tersembunyi atau aplikasi yang tersembunyi di dalam area yang tidak terautentikasi. Dari situ, kita bisa mencari endpoint yang menerima input dari user, lalu mencoba melakukan injeksi dan memanipulasi DOM dengan cara yang menguntungkan kita.

Manfaat dari strategi ini adalah karena endpoint yang tidak terautentikasi bisa diakses oleh siapa saja. Kita tidak perlu login untuk mengirim payload, sehingga lebih mudah untuk menunjukkan dampaknya kepada pemilik program. Bahkan jika itu adalah halaman yang tidak populer atau subdomain yang jarang disentuh, tetap bisa menjadi bukti yang valid jika ditemukan celah.

## 2. Reflected Input in Authenticated Routes / Input yang direfleksikan pada endpoint/rute yang memerlukan autentikasi

Kita perlu menemukan rute/endpoint yang memerlukan autentikasi. Di dalam rute tersebut, kita akan mencari endpoint tersembunyi atau fungsi yang tidak terlihat secara langsung, karena hal ini dapat meningkatkan peluang kita untuk menemukan cara yang efektif dalam melakukan injeksi ke dalam DOM di sisi client.


## 3. DOM Injection (Custom JavaScript) & NPM Packages

Kita akan mencari **file JavaScript kustom** yang berpotensi bisa digunakan untuk melakukan injeksi di browser. Ini berkaitan dengan konsep **source dan sink di client-side**, di mana pada endpoint tertentu tidak selalu ada request ke server, karena eksekusi terjadi langsung di browser.

Disebut **JavaScript kustom** karena jika kita melihat library atau paket JavaScript yang sudah umum digunakan, biasanya mereka sudah diuji dan memiliki mekanisme sanitasi untuk mencegah XSS. Meskipun tetap ada kemungkinan menemukan **CVE (kerentanan yang sudah diketahui)**, itu bukan fokus utama dalam bug hunting aplikasi.

---

### **Fokus Utama**

Jika kamu mencari XSS pada sistem yang menggunakan library seperti:

* React
* Angular
* atau package umum lainnya

Maka sebenarnya kamu sedang masuk ke ranah **security research (CVE)**, bukan sekadar bug bounty aplikasi. Banyak pemula sering salah arah di sini—mereka mencoba mencari celah langsung di library, padahal itu jauh lebih kompleks.

Sebaliknya, fokus kita adalah:

* **Bagaimana aplikasi menggunakan library tersebut**
* **Bagaimana kita bisa memanipulasi alur aplikasi**
* **Bagaimana data dari user bisa masuk ke DOM tanpa sanitasi**

---

### **Target yang Dicari**

Kita akan mencari **file JavaScript kustom** yang:

* Mengambil **input dari user**
* Lalu memproses input tersebut
* Dan akhirnya:

  * mengeksekusi JavaScript, atau
  * menulis langsung ke DOM

Di titik inilah potensi **DOM-based XSS** bisa muncul.

---

### **Analisis NPM Packages**

Kita juga akan melihat **NPM packages** yang digunakan oleh aplikasi, terutama:

* Versi yang digunakan
* Apakah memiliki **CVE yang diketahui**

Namun penting dipahami:

**Hanya karena ada CVE di sebuah package ≠ berarti aplikasi tersebut rentan.**

Kenapa?

* Kerentanan biasanya hanya terjadi pada **fungsi/metode tertentu**
* Jika aplikasi tidak menggunakan bagian yang rentan, maka tidak ada bug

---

### **Validasi Temuan**

Jika kamu menemukan hasil dari:

* Burp Scanner
* atau tools lain

Itu **bukan berarti langsung valid vulnerability**.

Langkah yang benar:

1. Identifikasi metode yang rentan
2. Cek apakah aplikasi benar-benar menggunakannya
3. Lakukan **fuzzing / pengujian manual**
4. Verifikasi apakah input bisa mencapai sink yang berbahaya

Jika fuzzer tidak menemukan jalur eksploitasi, kemungkinan besar:
➡️ Tidak ada celah yang bisa dimanfaatkan di sana

---

### **Kesimpulan**

Fokus kita bukan sekadar menemukan library yang rentan, tapi:

* **Menemukan bagaimana data user mengalir di aplikasi**
* **Mengidentifikasi titik injeksi di DOM**
* **Membuktikan apakah benar-benar bisa dieksploitasi**


