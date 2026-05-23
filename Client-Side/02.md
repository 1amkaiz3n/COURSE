# Virtual DOM

Pendekatan rendering yang digunakan oleh framework modern di mana pembaruan UI dilakukan melalui representasi virtual dari DOM. Secara default, framework ini akan melakukan escaping pada input user sebelum memasukkannya ke halaman. Namun, keputusan developer yang tidak aman (misalnya `dangerouslySetInnerHTML` di React) bisa kembali membuka risiko injeksi.

**React**
Melakukan escape pada value secara default sebelum dirender ke DOM. XSS hanya bisa muncul jika developer menggunakan library pihak ketiga yang tidak aman atau fitur berbahaya.

**Angular**
Memiliki sanitizer bawaan yang secara otomatis melakukan escape pada nilai yang tidak dipercaya. Hanya kode yang secara eksplisit menggunakan metode `bypassSecurityTrust` yang bisa memasukkan HTML atau script mentah.

**Vue**
Melakukan escape pada data binding secara default saat menggunakan `{{ }}`. Risiko XSS muncul jika developer menggunakan `v-html` atau merender template yang tidak dipercaya secara langsung.


Sebagian besar web aplikasi yang kita uji akan menggunakan sesuatu seperti React, Angular, Vue, Next.js, atau framework lainnya. Framework JavaScript client-side ini memanfaatkan virtual DOM dan semuanya bekerja dengan cara yang berbeda. Kita tidak akan membahas itu secara mendalam.

Tetapi pada dasarnya, apa artinya itu dalam banyak kasus dan apa yang akan terjadi terlihat seperti ini bagi kamu sebagai penguji. Kamu bisa memiliki payload yang terlihat seolah-olah tidak terpengaruh oleh hal lain seperti compensating controls, dan terlihat seperti sedang dimuat di DOM. Jadi kamu lihat `<script>alert(1)</script>`, terlihat seperti semuanya baik-baik saja. Namun itu tidak dieksekusi, dan saya sering mendapatkan ini, biasanya orang akan bertanya seperti itu. Saya akan ambil tangkapan layar.

Alasannya biasanya karena aplikasi tersebut menggunakan sesuatu seperti React. React menggunakan JSX di frontend-nya. Ini membangun sebuah virtual DOM. Semua perubahan DOM diproses di dalam virtual DOM tersebut, lalu sistem akan meneruskan hasil akhirnya ke DOM asli di browser tanpa memberikan kesempatan untuk JavaScript dieksekusi secara langsung.

Jadi ketika DOM dimanipulasi di dalam virtual DOM, tag `<script>` tersebut tidak dieksekusi karena masih berada di lingkungan virtual. Setelah itu, hasilnya baru dikirim ke DOM utama, dan itulah alasan kenapa kode tersebut tidak dieksekusi.

Jadi ada metodologi terpisah untuk menguji aplikasi yang di bangun dengan DOM Virtual.Setiap Framework memiliki caranya sendiri melakujkn ini.Sebagian besar dari merek memiliki beberapa cara untuk melakun ini dengan cara yagn tidak aman.