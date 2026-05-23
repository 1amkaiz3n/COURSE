# STRIDE Threat Modelling

STRIDE adalah singaktan dari ke enam kategori Threat modelling.Yang pada dasarnya memastikan  bahwa Anda ajukan pertanyaan yang tepat pada diri sendiri.

* Spoofing
* Tampering
* Repudiation
* Information Disclosure
* Denial of Service
* Elevation of Privilages


## Spoofing

Spoofing terjadi ketika Attacker mampu untuk menyamar sebagai user lain,sistem,atau komponen terpercaya tanpa secara sah memberikan identitas tersebut.


Kasus nyata **spoofing**:

  * Menggunakan kembali token OAuth atau session yang diterbitkan untuk satu aplikasi ke API lain.
  * Menggunakan token yang tidak terikat ke pengguna, tenant, atau client tertentu.
  * Menyamar sebagai pengguna lain dengan mengganti nilai `user_id`, `sub`, atau `email` pada token yang validasinya lemah.
  * Memalsukan atau mengulang (replay) request yang sudah ditandatangani ketika verifikasi tanda tangan tidak lengkap atau salah konfigurasi.


**Memaksa aplikasi untuk menerima identitasmu sebagai pengguna sah lain atau sebagai sistem tepercaya.**

## Tampering

Tampering terjadi ketika attacker mengubah data yang diasumsikan oleh aplikasi sebagai benar atau tidak pernah diubah.

Hal ini sering terjadi ketika server terlalu bergantung pada input dari client untuk menentukan state, kepemilikan, atau logika bisnis.

Bahkan perubahan kecil pada field yang dipercaya bisa menyebabkan aksi tidak sah atau kerusakan data.

**Kasus nyata Tampering:**

* Mengubah object ID untuk memodifikasi atau menghapus data milik user lain
* Mengubah parameter request yang mengontrol role, harga, atau akses
* Menyisipkan field tambahan ke dalam body JSON yang diproses backend
* Memanipulasi nilai yang dihitung di sisi client tetapi dipercaya oleh server

**Mengubah data yang seharusnya tidak kamu kontrol untuk mempengaruhi perilaku aplikasi**


## Repudiation

Repudiation terjadi ketika attacker dapat melakukan aksi sensitif tanpa tindakan tersebut tercatat, teratribusi dengan benar, atau bisa diaudit.

Ketika sistem gagal mencatat siapa melakukan apa dan kapan, attacker bisa menyangkal tanggung jawab, dan pihak defender kehilangan visibilitas terhadap penyalahgunaan.

Dalam skenario bug bounty, hal ini sering memperbesar dampak dari kerentanan lain karena aktivitas berbahaya jadi lebih sulit dideteksi atau diinvestigasi.

**Kasus nyata Repudiation:**

* Memodifikasi atau menghapus data tanpa menghasilkan audit log
* Melakukan aksi sensitif yang tidak terikat dengan identitas user
* Menjalankan background job atau webhook tanpa atribusi
* Melakukan replay request setelah logout atau session berakhir

**Melakukan aksi tanpa akuntabilitas atau menghapus jejak dari aksi tersebut**


## Information Disclosure

Information disclosure terjadi ketika sebuah aplikasi mengungkapkan data di luar akses yang seharusnya dimiliki attacker atau di luar konteks yang dimaksud.

Ini mencakup baik paparan langsung data sensitif maupun kebocoran tidak langsung yang bisa membantu serangan lanjutan. Dalam bug bounty, isu seperti ini sering jadi “force multiplier”, karena bisa mengubah celah kecil menjadi dampak besar.

**Kasus nyata Information Disclosure:**

* Mengakses data user lain melalui IDOR atau broken object authorization
* API mengembalikan field atau metadata berlebihan yang sebenarnya tidak diperlukan
* Error message membocorkan ID internal, stack trace, atau aturan akses
* Mengunduh file atau dokumen privat tanpa otorisasi yang benar

**Mengekspos informasi yang seharusnya tidak bisa diakses oleh attacker**


## Denial of Service (DoS)

Denial of Service terjadi ketika attacker dapat mengonsumsi resource secara tidak proporsional, sehingga menyebabkan penurunan performa atau bahkan downtime.

Dalam program bug bounty, sebagian besar serangan DoS berbasis volume biasanya out of scope, tetapi DoS logika atau di layer aplikasi sering masih in scope jika bisa dipicu hanya oleh satu user atau satu request. Hal ini penting karena penyalahgunaan terjadi lewat fitur normal aplikasi, bukan dengan membanjiri infrastruktur.

**Kasus nyata Denial of Service:**

* Memicu operasi yang mahal dengan request kecil atau berulang
* Mengirim payload besar atau kompleks yang menyebabkan penggunaan resource berlebihan
* Menyalahgunakan fitur background job, export, atau pembuatan laporan
* Menyebabkan kehabisan resource melalui loop atau rekursi tanpa batas

**Menguras resource atau menimbulkan biaya berlebih hingga mengganggu fungsi aplikasi**



## Elevation of Privileges

Elevation of Privileges terjadi ketika attacker bisa melakukan aksi yang seharusnya hanya diperbolehkan untuk user, role, atau sistem dengan tingkat kepercayaan lebih tinggi.

Hal ini sering terjadi karena tidak adanya atau tidak konsistennya pengecekan authorization, kebingungan role, atau alur yang saling terhubung antar mekanisme. Dalam bug bounty, isu ini berdampak tinggi karena sering membuka akses ke fungsi admin, data sensitif, atau aksi yang tidak bisa dibatalkan.

**Kasus nyata Elevation of Privileges:**

* Mengakses API atau panel admin sebagai user biasa
* Melakukan aksi privilege dengan mengubah field role atau permission
* Menggabungkan IDOR dengan kontrol role yang lemah untuk memperluas akses
* Mengakses fitur yang dibatasi dengan melewati alur penggunaan yang seharusnya

**Mendapatkan kemampuan yang melebihi hak akses yang awalnya diberikan**
