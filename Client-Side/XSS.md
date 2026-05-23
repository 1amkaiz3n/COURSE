# Client-Side Injections - Reflected and Stored Cross-Site Scripting XSS

## Client-Side Injections

### Apa itu Cllient-side Injections??

* Penyerang memaksa korban untuk mengeksekusi JavaScript di browser mereka yang tidak dimaksudkan oleh developer.
* Input yang dikontrol oleh user mengubah perilaku aplikasi di browser korban.
* Harus bisa mengirimkan payload ke korban untuk menunjukkan dampaknya.
* Biasanya didemonstrasikan dengan “memunculkan alert”, tapi saya akan menunjukkan bahwa kamu bisa melakukan jauh lebih dari itu.


Ini hanya akan terjadi memlalui payload yagn memanipulasi DOM di dalam cara agar javascript mengeksekusi atau beberapa payload perlu masuk ke request HTTP mungkin saja tercermin (reflacted) langusn di dalam response tersebut,dia mungkmin akan tersimpan di dalam database dan kemudian kembali.Mungkin tidak akan pernah meninggalkna browser sama sekali,mungkin saja itu akan tetap ad di dalam browser dan di eksekusi di dalam DOM sebagai Javascript Client-Side.

Ada banyak hal yagn berbeda cara yagn bis kita lakukan untuk ini.Tetapi pada akhirnya attacks vectors yagn kita cari akan memulai ke mana anda mengirimkan payload tersebut akan berada dalam request HTTP di suatu tempat di dalam request HTTP tersebut,terdapat sebuah nilai yagn di ambil itu,itulah User-Controlled input yang kemudian menjadi di proses oleh aplikasi dan memanipulasi DOM.Cara DOM bekerja hasil yagn di manipulasi dalam javascript mengeksekusi dan kemudian ide dari persfektif penyerang adalah memiliki hal itu,javascript berbahaya dan menargetkan korban dalam beberapa hal.


## 4 Jenis Client-Side Injections

### 1. Reflected XSS

Input yang dikontrol oleh user dari HTTP request langsung direfleksikan ke dalam HTTP response server.

-> Payload dikirim dalam HTTP request
-> Payload direfleksikan dalam HTTP response
-> Payload tidak dimodifikasi
-> Serangan dikirimkan ke korban

Contoh:

Response:

* `GET /main.js1amkaiz3n HTTP/2`

Request:

* `<key>main.js1amkaiz3n</key>`

Di sini kita punya HTTP request dan HTTP response. Nilai `1amkaiz3n` disebut “canary”.

Canary biasanya dipakai untuk testing dan validasi dalam konteks XSS, untuk memastikan apakah input yang kita kirim benar-benar direfleksikan atau diproses oleh aplikasi.

Kita sengaja membuat canary berupa string yang hampir pasti tidak akan muncul secara natural di aplikasi. Karena itu, banyak orang menggunakan nilai unik sendiri, supaya kecil kemungkinan bentrok dengan data asli di DOM, tergantung kompleksitas aplikasi.

Intinya, canary membantu kita melacak alur input sampai ke response dengan lebih akurat.
mungkminkan kita untuk dengan mudah mencari response untuk melihat apakah user-controlled input sebenrnay di reflected di DOM.

Jadi HTTP request dikirim ke server, lalu server langsung mengembalikan response yang masih mengandung payload tersebut. Response ini kemudian dimuat ke DOM.

Dalam kondisi ini, tujuan kita adalah melihat apakah kita bisa menyisipkan sesuatu seperti tag `<script>` ke dalam response. Jika berhasil di-inject, maka saat response dirender kembali oleh browser, tag tersebut akan ikut dieksekusi sebagai JavaScript.

Dari situ, JavaScript yang kita injeksikan bisa berjalan di sisi korban. Ini juga berarti attack vector harus berasal dari input yang dikontrol lewat URL, misalnya melalui path, GET parameter, atau parameter lain yang diproses oleh server.

Intinya, kita mencari titik di mana input dari URL bisa masuk ke response tanpa difilter, lalu berujung dieksekusi di DOM.


### 2. Stored XSS

Input yang dikontrol oleh user disimpan di aplikasi web, lalu kemudian diakses atau dirender di DOM korban, sehingga payload yang tersimpan tersebut dieksekusi.

- **Field di database backend** dimuat ke DOM dan dirender ke HTML tanpa encoding atau sanitasi yang tepat.
- **Log aplikasi dan audit trail** dimuat ke aplikasi manajemen internal, yang dapat menyebabkan Blind XSS.
- **Key/value store dan data cache** dari database non-relasional (Redis, MongoDB, dll.) juga dapat diproses saat runtime.


**DATABASE** terdiri dari:

* RECOR**D**S
* REL**A**TIONS
* ADMINIS**T**RATIONS
* D**A**TA
* TA**B**LE
* INFORM**A**TION
* ACCE**S**S
* OBJ**E**CT

Kalau disusun konsepnya, **DATABASE** itu kumpulan data yang tersusun dalam bentuk tabel (table), yang berisi records (baris data), saling terhubung lewat relations, dan dikelola melalui sistem akses serta administrasi untuk mengatur informasi dan objek di dalamnya.


Cara termudah untuk menjelaskan **Stored XSS** adalah,misalkan kita memiliki halaman profil,di san kita memiliki First Name,Last Name,dll,tempat diman kita bisa mengubah data profiel kita.ini tempat yang paling umum untuk **Stored XSS**.Jadi misaknya kita ganti firstnme kita misalknay dengan `<script>alert(1);</script>`,tujuanny adalah agar data tersebut tersimpan di dalam database dan di manapun firstname itu di muat di DOM.Semoga saja mereka tidak melakukn sanitasi,atau tidak ad kontol kompensasi  yagn mempengaruhi ini.Namun jika semunay berjalan lancar untuk penyerang,maka setelah halaman di muat akan otomatis menjalankan script itu.

### 3. DOM-Based XSS

JavaScript sisi client memproses input dari user dan secara dinamis memperbarui DOM (Document Object Model) dengan cara yang tidak aman. Pada kasus ini, HTTP request tidak perlu dikirim ke server, karena serangan terjadi sepenuhnya di browser korban.

DOM-Based XSS terjadi ketika data yang tidak dipercaya mengalir dari sebuah source (misalnya `location.hash`) menuju sink yang berbahaya (misalnya `innerHTML`), sehingga menghasilkan eksekusi kode yang dikirim oleh penyerang. Contohnya, saat mengunjungi `https://site/#<img src=x onerror=alert(1)>`, browser akan menjalankan script yang disisipkan.

- **Payload disimpan di memori lokal**
- **Kode sisi client memproses payload tersebut**
- **Tanpa validasi, payload akan dieksekusi**



### 4. Client-Side Prototype Pollution

Client-Side Prototype Pollution adalah kerentanan JavaScript di mana penyerang bisa menyisipkan properti secara bebas ke `Object.prototype` (atau prototype lainnya) di browser, sehingga properti tersebut akan diwarisi oleh semua object.

Karena object di JavaScript mewarisi properti dari prototype-nya, hal ini bisa dimanfaatkan untuk memanipulasi logika aplikasi, melewati pengecekan keamanan, bahkan dalam beberapa kasus bisa mengarah ke eksekusi kode seperti XSS.

---

```js
init: function () {
  var self = this;
  this.element.html(can.view('//app/src/views/signs'));
  this.element.parent().addClass('login-screen');
}
```

#### -> Source (Input Injection)

* Penyerang mengirim input yang sudah dimanipulasi melalui JSON, query parameter, body POST, atau input lain yang kemudian digabungkan ke dalam object aplikasi.
* Contoh payload:
  `?__proto__[isAdmin]=true`


#### -> ink (Object Merging)

* Aplikasi menggunakan fungsi yang tidak aman seperti `Object.assign()`, `$.extend()` (jQuery), atau custom merge function tanpa memfilter key berbahaya seperti `__proto__`, `constructor`, atau `prototype`.


#### -> Execution / Impact

* Setelah terjadi pollution, semua object yang dibuat setelahnya akan mewarisi properti berbahaya tersebut.
* Hal ini bisa menyebabkan bypass logika (misalnya `if (user.isAdmin)` menjadi true untuk semua user), atau masalah keamanan lainnya ketika properti yang terkontaminasi masuk ke DOM dan berujung pada XSS.


## Executing VS Weaponizing

Executing XSS atau client-side injection berarti membuktikan bahwa payload bisa berjalan (misalnya dengan `alert(1)`), sedangkan weaponizing berarti mengubah payload tersebut menjadi serangan yang memiliki tujuan berbahaya (seperti mencuri cookie, meningkatkan privilege, atau menyebarkan malware persisten).

**-> Executing**

  * <u>Definition:</u> ketika payload yang dibuat berhasil dijalankan di browser korban.
  * <u>Scope:</u> hanya untuk memastikan titik injeksi memang vulnerabilitas.

**-> Weaponizing**

  * <u>Definition:</u> mengubah injeksi yang sudah berhasil menjadi serangan nyata dengan tujuan tertentu (data theft, account takeover, privilege escalation).
  * <u>Scope:</u> berkembang dari sekadar proof of concept → eksploitasi yang berdampak nyata.

