# **Compensating Controls**

**Compensating Controls** adalah salah satu celah pemahaman terbesar yang sering saya lihat pada pemula saat mencoba mengeksploitasi **client-side XSS**.

Banyak peneliti yang baru mulai sering melewatkan bagian ini. Padahal, memahami **compensating controls** sangat penting karena hal ini akan menentukan apakah payload XSS yang kita buat benar-benar bisa berjalan atau justru terblokir.

Dengan kata lain, kita tidak hanya perlu menemukan titik injeksi, tetapi juga harus memahami mekanisme proteksi yang ada, karena kontrol inilah yang mempengaruhi apakah eksploitasi XSS di sisi client bisa berhasil atau tidak.

---

Ada banyak **compensating controls** yang bisa diterapkan dalam sebuah aplikasi untuk mencegah eksekusi JavaScript berbahaya. Biasanya, kontrol ini tidak berdiri sendiri, tetapi **berlapis-lapis**. Ini adalah bagian penting yang sering terlewat oleh pemula.

Sering terjadi, seseorang menemukan bahwa input user mereka **direfleksikan dalam response**. Secara kasat mata, mungkin terlihat tidak ada sanitasi yang kuat—misalnya karakter seperti `< >` atau bahkan tag `<script>` muncul di DOM. Namun, JavaScript tetap tidak berjalan.

Di titik ini, banyak yang mengira mereka sudah menemukan bug, padahal belum tentu. Penyebabnya adalah adanya **lapisan-lapisan proteksi (compensating controls)** yang bekerja di balik layar. Konsep ini dikenal sebagai **defense in depth** atau pertahanan berlapis.

---

Dalam praktiknya, **blue team** akan menerapkan berbagai lapisan keamanan untuk membuat eksekusi JavaScript berbahaya menjadi sesulit mungkin. Mereka tidak hanya memfilter input di awal, tetapi juga menambahkan perlindungan di berbagai titik, seperti:

* saat request diproses
* saat response dirender di browser
* hingga mekanisme keamanan bawaan di browser itu sendiri

---

Di bagian ini, kita akan membahas **7 jenis compensating controls** yang berbeda, yang dapat mempengaruhi keberhasilan kita dalam menginjeksi JavaScript berbahaya ke dalam DOM melalui **client-side injection**.


## 1. Cookie Flags

Ketika kita berhasil melakukan XSS atau injeksi di sisi client, langkah berikutnya adalah memastikan payload tersebut juga bisa berjalan di browser korban. Biasanya ini dilakukan dengan mengirimkan link berisi payload, sehingga saat korban mengaksesnya, kode akan dieksekusi di browser mereka.

Jika payload berhasil dijalankan, tujuan utamanya adalah mengakses atau mengambil **data sensitif** dari aplikasi yang sebelumnya tidak bisa kita jangkau secara langsung.

---

Salah satu cara paling umum untuk menunjukkan dampak dari XSS adalah dengan **mencuri data user**, terutama **session token**. Dengan mendapatkan session token, kita berpotensi:

* Mengambil alih sesi user
* Mengakses data sebagai user tersebut
* Melakukan aksi atas nama korban

Namun, kemampuan kita untuk mengakses cookie tersebut sangat bergantung pada **Cookie Flags** yang diterapkan, khususnya **HttpOnly**.

**HttpOnly** menentukan apakah cookie bisa diakses oleh JavaScript di sisi client atau tidak.
Jika sebuah **session token** memiliki flag **HttpOnly**, maka:

* Cookie tersebut **tidak bisa diakses melalui JavaScript**
* Kita tidak bisa langsung mengambil nilainya lalu mengirimkannya ke server attacker

Artinya, kita tidak bisa hanya mengandalkan metode sederhana seperti membaca cookie lewat JavaScript. Kita perlu pendekatan yang lebih kreatif jika ingin mengeksploitasinya.

---

Karena itu, **Cookie Flags** memiliki dampak besar terhadap keberhasilan eksploitasi **client-side XSS**.
Langkah pertama yang harus kita lakukan adalah selalu mengecek:

* Apakah cookie memiliki flag **HttpOnly**
* Dan bagaimana konfigurasi cookie lainnya mempengaruhi akses kita


**-> HttpOnly**
Mencegah JavaScript membaca cookies, sehingga XSS tidak bisa mencuri session token.

**-> Secure**
Memaksa cookie hanya dikirim melalui HTTPS, mencegah kebocoran lewat koneksi yang tidak aman.

**-> SameSite**
Membatasi cookie pada request lintas situs (cross-site), sehingga mengurangi kemungkinan XSS dimanfaatkan untuk CSRF.

**-> Domain & Path**
Membatasi cookie hanya pada host atau path tertentu, sehingga dampaknya lebih kecil jika XSS terjadi di area yang kurang terpercaya.

**-> Max-Age / Expires**
Mengatur berapa lama cookie bertahan, sehingga mempersempit waktu bagi attacker untuk menyalahgunakannya jika berhasil dicuri.



## 2. Browser Security Header

Menerapkan **browser security headers**, khususnya header **X-XSS-Protection**, sangat penting untuk mencegah attacker memanfaatkan serangan **client-side injection**.

Header **X-XSS-Protection** dirancang untuk mengaktifkan atau menonaktifkan mekanisme perlindungan **Cross-Site Scripting (XSS)** bawaan browser. Jika header ini diatur dengan nilai `1; mode=block`, maka browser akan diperintahkan untuk **memblokir rendering halaman** ketika mendeteksi adanya potensi serangan XSS.

Dengan adanya header **X-XSS-Protection**, meskipun attacker mencoba menginjeksi script berbahaya ke dalam halaman yang rentan, browser akan **mengintervensi dan memblokir halaman tersebut**, sehingga dampak serangan dapat dikurangi.

Header ini menjadi salah satu **lapisan keamanan tambahan** yang kuat dalam meningkatkan ketahanan aplikasi web terhadap kerentanan client-side injection, melengkapi mekanisme keamanan lain seperti **validasi dan sanitasi input**.


## 3. Content Security Policy (CSP)

Menerapkan **Content Security Policy (CSP)** adalah salah satu mekanisme pertahanan yang kuat terhadap serangan **client-side injection**.

CSP berfungsi untuk menentukan dan menegakkan sumber konten apa saja yang dianggap valid oleh browser pada sebuah halaman web. Dengan menentukan sumber yang diperbolehkan untuk **script, style, dan resource lainnya**, CSP yang dikonfigurasi dengan baik dapat membatasi eksekusi script berbahaya yang diinjeksikan.

Sebagai contoh, jika terdapat directive seperti:

```
script-src 'self'
```

maka browser hanya akan mengeksekusi script yang berasal dari domain yang sama dengan website tersebut.

---

Dengan adanya CSP yang efektif, upaya attacker untuk menginjeksi dan mengeksekusi script berbahaya akan mengalami banyak keterbatasan, karena kode yang diinjeksikan akan diblokir jika melanggar aturan kebijakan CSP.

Pendekatan ini merupakan langkah **proaktif** dalam mengurangi risiko serangan, karena memberikan kontrol yang lebih detail terhadap sumber konten yang boleh dieksekusi di browser.

TOOLS : [csp-evaluator](https://csp-evaluator.withgoogle.com/) 

## 4. Web Application Firewall (WAF)

Menerapkan **Web Application Firewall (WAF)** merupakan salah satu mekanisme pertahanan yang kuat terhadap serangan **client-side injection**.

WAF adalah sistem keamanan (berupa perangkat atau layanan) yang bertugas untuk **memfilter dan memonitor trafik HTTP** antara aplikasi web dan internet, serta mengidentifikasi dan memblokir request yang berpotensi berbahaya.

WAF biasanya dilengkapi dengan **rule set** yang dirancang untuk mendeteksi dan mengurangi berbagai jenis serangan, termasuk yang menargetkan kerentanan client-side seperti **XSS**.

---

Dalam konteks client-side injection, WAF dapat:

* Menganalisis request yang masuk
* Mendeteksi pola yang mencurigakan (indikasi injeksi)
* Memblokir atau melakukan sanitasi terhadap konten berbahaya sebelum mencapai aplikasi

Dengan menggunakan teknik seperti:

* **signature-based detection**
* **heuristic analysis**
* **behavioral analysis**

WAF mampu mendeteksi dan mencegah berbagai jenis serangan injeksi.

---

Dengan demikian, WAF memberikan **lapisan keamanan tambahan** yang melengkapi kontrol keamanan di level aplikasi, sehingga meningkatkan perlindungan secara keseluruhan terhadap serangan client-side injection.


## 5. Client-Side Validation

**Client-side validation** adalah mekanisme yang berguna untuk memberikan feedback secara langsung kepada user dan meningkatkan pengalaman penggunaan. Namun, mekanisme ini **tidak boleh dijadikan sebagai pertahanan utama** terhadap serangan **client-side injection**.

Meskipun client-side validation dapat membantu mencegah kesalahan input yang tidak disengaja dan memperbaiki tampilan antarmuka, hal ini **bukanlah kontrol keamanan yang kuat** jika berdiri sendiri.

---

Salah satu keterbatasan utama dari client-side validation adalah karena prosesnya terjadi di **browser user**, sehingga sangat mudah dimanipulasi oleh attacker.

Penyerang dapat dengan mudah:

* Melewati (bypass) validasi
* Menonaktifkan validasi
* Memodifikasi kode client-side

Teknik yang biasa digunakan antara lain:

* Menggunakan **browser developer tools**
* Menggunakan **proxy tools** seperti Burp Suite
* Mengubah langsung kode JavaScript di sisi client


---

Karena itu, sangat penting untuk **menggabungkan client-side validation dengan server-side validation** serta mekanisme keamanan lainnya. Pendekatan ini diperlukan untuk memastikan perlindungan yang lebih menyeluruh terhadap serangan **client-side injection**.


## 6. Server-Side Validation

**Server-side validation** terhadap input yang dikontrol oleh user merupakan mekanisme pertahanan yang sangat penting terhadap serangan **client-side injection**.

Dengan menerapkan validasi di sisi server, aplikasi memastikan bahwa setiap input dari user memenuhi kriteria tertentu sebelum diproses. Hal ini mencegah attacker memanfaatkan input untuk melakukan eksploitasi, seperti **XSS**.

Berbeda dengan client-side validation, server-side validation:

* Tidak bergantung pada kode di browser
* Tidak mudah dibypass atau dimanipulasi oleh attacker
* Memberikan perlindungan yang jauh lebih kuat terhadap serangan injeksi

---

Tanpa server-side validation yang tepat, attacker dapat mencoba menginjeksi script berbahaya melalui input user untuk mengeksploitasi celah di sisi server.

Karena itu, server-side validation berperan sebagai **lapisan pertahanan terakhir**, memastikan bahwa hanya data yang valid dan sudah disanitasi yang diproses oleh server.


## 7. Output Encoding

**Output encoding di sisi server** merupakan salah satu mekanisme pertahanan yang sangat penting terhadap serangan **client-side injection**, khususnya **XSS**.

Praktik ini dilakukan dengan cara **meng-encode atau mentransformasikan data output** sebelum ditampilkan di browser, sehingga setiap konten yang berasal dari user sudah dalam kondisi aman. Tujuannya adalah agar input user tidak diinterpretasikan sebagai kode yang bisa dieksekusi.

Dalam konteks aplikasi web, salah satu teknik yang umum digunakan adalah **URL encoding**, yaitu mengganti karakter khusus dengan bentuk encoded (persen-encoding).

---

Dengan adanya encoding ini, browser tidak akan menganggap input sebagai script yang bisa dijalankan, sehingga potensi serangan XSS dapat dicegah.

Sebagai contoh:

* `<` menjadi `%3C`
* `>` menjadi `%3E`
* `"` menjadi `%22`

Dengan cara ini, karakter-karakter tersebut diperlakukan sebagai **teks biasa**, bukan bagian dari kode yang bisa dieksekusi.

---

**Output encoding** sangat efektif dalam mengurangi risiko serangan injeksi, karena mampu menetralkan karakter khusus yang bisa disalahartikan oleh browser sebagai bagian dari script berbahaya.
