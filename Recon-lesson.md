# Lesson Recon youtube rs0n_live
Target -> starbucks.com.sg

Pertama yang akan kit lakukan adalah **mengidentifikasi** bagaimana sebuah aplikasi manarik kumpulan data yang lebih besar dan **memvalidasi** user,dan biasanya cara termudah untuk melakunnay adalah dengan beberap jenis **token session,JWT,dan semacamnya**.

Jadi yang akan saya lihat pertam disini adalah **cookie**,dan kita perlu menemukna suatu tempat  di dalam aplikasi diman kita pikir mekanisme ini di gunakan,dan bagian **halman profile** ini adalah pillihan yagn bagus.

Jadi disni saya mencoba untuk menyalkan proxy dan masuk ke burup suite untk menangkap request dari halman profile ini

dan disni kita melihat ad request `GET /rewards/profile`,dan di dalam request ini kita memeiliki banyak data.

Sekarang ,di suatu tambpat di backend,aplikasi menggunakan data yang ada untk menentukan user man kita.Dan yagn pertam akan kita cari tahu adalah,apakh itu di lakuan di Backend atau di Frontend,karena .NET akan memberihau saya bahwa itu mungkin terjadi di Backend,karena mereka menggunakan **React**,mungkin memiliki lebih banyak panggilan API.

Dan jika kit lihat di burp suite,,disni kita bis melihat banyk sekali request GET ke file javascript dan hal hal lainnya.
Jadi sangat mungkin bahwa meskipun kita memiliki aplikasi .NET,atau bagian darinya hanya memuat DOM inti,lalu sejumlah Javascript  di jalankn untuk mengisinya secara dinamis.

Salah satu cara mudah untuk melakukannya adalah degan melihat beberapa informsi pribadi saya.Jadi,apakha informasi tersebut ada di dalam response awal atau tidak?,kemungkinan besar itu berasal dari React dan panggilan API yagn menambil informasi ini.Jadi,saya akan cari **username** saya di dalam rsponse nya,dan,ya memang ada.


Jadi kita malihat nay kalau username kita ada di dalam response.Ada mekanisme di sisi backend yang mengidentifikasi user kita berdasarkan semacam `ID`,kecuali ada sesuatu yang terkandung di dalamnya yang dapat kita kontorl secara langsung.

Pada titk ini,kita merefleksikan input dan kita dapat menguji **XSS** dan hal lainnya,tetapi itu akan sangant mengejutkan.Hampir pasti yagn akan terjadi adalah ada nilai di dalam cookie  atau di tempat lain,tetapi sebenarnny tidak ad di teampat lain.

Jadi kemungkinan besar ada nilai dalam cookie yang di gunakn di sisi server untuk mengidentifiaksi user saya.Jadi inilah user_id dari pengguna tersebut,id di ambil dari basis data,nama depa nsaya,nam belakang saya,tanggal lahir saya,dan semau data yagn masuk.

Jadi kami telah meengidentifikasi area dimana pengidentifiaksi unik di gunakakn untuk mengambil subset data yagn lebih besar,itulah kesempatan anda untuk menguji refrensi objek tidak langung.

Jadi mari kita lihat apakah kita dapat mengetahui bagaiman tepatnya hal itu terjadi,dan kita melakukannya hanya dengan menyingkirkan cookie atau tempat lain yagn kita pikir data mungkin berada,sampai kita memiliki **HTTP Request** sekecil mungkin yang masih memungkinkn kit untuk mengakse data di response,dan kemudian mudah-mudahaln dari san kita dapat menyimpulkan bagaiman tepatnya aplikasi mengidentifikasi kita,dan kemudain kita dapat menargetkan penggun lain.

Jadi pertama-tama mari kita singkirkan Cookie beberapa data di cookie seperti anti csrf token `.AspNetCoer.AntiForgery.Bsdfdf=<Nilainya>`,dan kita send untk lihat bagaiman response nya,dan kita cari **username** kita di respon nyua,dan boommm,disni username kit tetap ada.

Jadi kesimpulannay **CSRF Token tampaknya tidk di gunakn dengan GET request untuk `/rewards/profile`**

ini memang tidak ad hubunngay degan IDOR,tapi say akn tersu mennguji endpoint lain, dan ini mungkin berubah menjadi token CSRF yagn sam sekali tidka berguna.Saya tidak tahu apakah itu akan membantu saya dalam pengujin say di masa mendatang,tetapi saya ingin memastikan bahwa saya mengetahui nya dan memilikinya,tergantung pad ap yag nsaya temukan di masa mendatang.

Jika kita lihat disini,saya melihat ad dau cookei yagn sangant menonjol,ada `auth` yang tampaknay hany urutan angka random,dan `ACCESS_TOKEN` yang merupakn JSON web Token.

Hanya dgna melihat ini,menurut saya kita memiliki JWT yagn berisi **ID** pengguna yagn di gunakn untk mengambil subset data yang lebih besar.Untuk mengetahui nay kit harsu melakukan  pengujian karen ini masih belum tentu benar juga.

selanjutna ykita akan coab juga untk singkirkan cookie lain dan hany menyiskan `auth` dan `ACCESS_TOKEN`,dan kita lihat responnya.Dan ternayta ini jgua masih berhasil.Ini memberitahu saya bahwa saya berad di jalur yagn benar.

Jadi hal berikutnay yang ingin saya lakukan adalah saya akan pergi ke `browser -> inspect element -> storage`,disni secara spesfik say ingin melihat  man aygn merupakan `token session` dan man yang memiliki `flag HTTP Only` atau Flag berharga lainnya.

Disni kita mendaptkan dau cookie yang memiliki `flag HTTP Only`,dan biasanya ini akn di tempatkan pada jenis cookie berharga apapn yagn tidak ingn di akse oleh penyerang.
Disini untuk `session token` kita tidak memiliki `flag HTTP Only`,dan ini petunjuk yang sangat sangat penting bagi kita


> "Analisis ini menunjukkan bahwa jika `session token` diimplementasikan tanpa validasi yang benar serta tidak memiliki flag **HttpOnly**, maka aplikasi tersebut sangat rentan. 
> 
> Alasannya, jika terjadi serangan **Basic XSS**, penyerang dapat dengan mudah 'mempersenjatai' celah tersebut. Tanpa **HttpOnly**, payload XSS bisa mencuri token autentikasi milik korban. Token tersebut kemudian dapat digunakan untuk mengirimkan *request* berbahaya atas nama korban (mirip dengan mekanisme **CSRF**). Kondisi di mana penyerang 'menunggangi' sesi aktif pengguna untuk melakukan aksi yang tidak sah inilah yang disebut sebagai serangan **Session Riding**."
>
> Pada dasarny ada memanfaatkan  session aktif ketika pengguna mengeeeeeeeeeeeeksekui payuload utuk dapat melakukan tindakan atas nama korban.Seringkali merak bahkan tidak menyadarinya 

JIka kita sudah menemukan beberapa kesalahn konfigurasi seperti ini,mak kita hampir pasti akan memiliki beberapa maslh sistematik yagn lebih dalam yagn terjadi di dalam aplikasi.

Sekarang kita kembai lagi ke Burp suit,,kita akan fokkus ke `ACCESS_TOKEN`,dan `auth` ,,sekarna kita coab hapu `auth` dari cookie dan kita kirim request,,dna yagn terjadi disni adalh kita mendapatkan resoponse 302 dan di arahkan ke halaman login.Jadi asumsi saya soal `auth` ini benar.Token ini untuk mengidentifikasi otentikasi..dan saya berasumsi juga kalau di dalam JWT`ACCESS_TOKEN` ini berisi ID user,,kemudian  say coba decode dgan base64,dan kita bis melihat kalu haslinh dini banyk pengidentifiakasi,

Masalh kedau disni adalah JWT ini berisi tanda tangan yagn di rancang untjk menjamin integritas data di dalam penyimpanan data.Jadi,sebagai Attacker,agar say dapat masuk dan dapat mengubah nilai ynag ada di JWt,dengan kata lain mengakses data si korban,say harus melewati validasi atau kontrol apapn yan mereka miliki diman mereka memeriksa tanda tangan ini untuk menentukan napakh data ini telah di rusak.

Ada beberap cara berbeda yagn dapat saya lakukan,dan biasanya ketika saya melakukan pengujian IDOR,saya akan melakukna beberap di antaranya,mungkmin menghindari yagn lebih rumit.Tetap hal pertama yang dapat kita lihat dan kita tentukan,adalah apa tanda tangan nya,enkripsi apa yang di gunakn untk menghasilkan tanda tangan tersebut.Dan ketika kita lihat,ni adalah **HS256**,**HS256** adalah enkripsi simetris buan asimetris.

Jadi pertama-tama,ini tidak umuk di gunakan,dan pertanyaan saya adalah,mengapa mereka menggunakan HS256??apakah ini sesuatu yan belum mereka tekankan,atau ini bukan.....Ini benr-benar terlalu berharg dan ini hanyalah cara termudah untuk melakukannya,tetapi saya berharap alas ini ad disini hany karean ini adalah implementasi  yang lebih lama dan rentan terhadap beberap jenis serangan yang lebih baru.Seperti yan kita tahu,ini berpotensi untuk kita melakun brute force,dll.

Jadi mari kita lakukan pengujian lagi untuk mengetahui apakah mereka memvalidasi ini atau tidak..jadi kita akan coba untk hapus beberapa bagan dari tanda tagan nya dan kirim request lagi,,nah yagn terjdi adal,respony berhasil dan kita tetap mendaptakn respon yang sama.Artinay mereka tidak memvalidasi tanda tangan nya

## Identifikasi Mekanisme Web Aplikasi
Untuk melakukn identifikasi mekanisme dalam sebuah aplkiasi,kita akan mengumpulkan dulu informasi dari web ini,Pertama tatam saya akan cari tau dulu data saya degna cara say masuk ke halan profile dan tangkap request nya,dan din isay mendaptkan data pribadi saya dari cookie `ACCESS_TOKEN` yang isinay JWT,dan say juga melakun hal yang sam di akun kedua saya

**Akun A**

```json
{
    "nameid" : "111112",
    "sub" : "111112",
    "full_ name" : "Akun Atttacker",
    "email" : "<email>"
}
```

**Akun B**
```json
{
    "nameid" : "111118",
    "sub" : "111118",
    "full_ name" : "Akun Victim",
    "email" : "<email>"
}
```

Disini saya sangat berharap bahwa `nameid` ini terlibat dalam mengakse data tersebut.
Jadi sekarang kita punya beberapa informasi tentang akun,kita pelru melakukna riset lebih lanjut tentang mekanisme spesifik ini.Tetapi sebelum kita melakukan nya,mari kita buat mapping nya untuk mekanisme,dan juga objects.

Jika kita lihat halaman profile ini, sebenarnya kita memiliki beberapa mekanisme berbeda disni,masing-masing atau setiap mekanisme di halaman ini akan menjadi kesempatan untk mendapatkan IDOR.Jadi,sebelum kita melakukan pengujian lebih lanjut,mari kita mulai menginventarisasi berbagai opsi yagn kita miliki disini.

Yang pertama kita lihat di halaman profie adalh kita memiliki bagian atau section informasi pribadi,dan beberapa mekanisme berbeda didalamnya.Jadi,mari kita lihat apa yagn di maksud.Kita sudah tahu bahwa ketika memuat halaman ini,akan ada semacam request atau sesuatu yagn di buat untuk membaca data disana.Jadi,kita sudah punya mappingnya seperti ini **READ = GET -> `/rewards/profile`**.

Kita juga memiliki kemampuan untuk update data,jadi kita akan coba update datnay dan kita tangakp request nya.

> itulah yang ingin kita lakukan pertama kali,kita mengidentifikasi mekanisme dan kemudian kita mengidentifikasi aspek **CRUD** apa yagn terjadi disini,

Di request ini,kita mendaptakn request degan method **POST** ke endpint `/rewards/profile` dan menyertakan data itu akan menyebabkan pembaruan di backend,jadi kita punya mapping tambhan seprti ini **UPDATE = POST -> `/rewards/profile`**.

Sekarang kita sudah memiliki dau hal yagn bagus untuk memulai dan dalam kedua kasus ini,jadi request GET ini untuk membaca data,dan request POST untuk memperbarui data nya.Masih perlu ada sesuatu dalam request  ini yang di gunakn oleh aplikasi untuk mengidentifikasi kumpulan data yagn lebih besar.Jadi,dia mengambil ID,dia mengambil sesuatu dan menggunakannya untk mengatakan,"oke user mana ini" dan kemudian mengembalikan data.

Akan sangat mudah untuk berasumsi bahwa keduanay menggunakan ID yang sama atau cara yagn sama untuk mengidentifikasi kumpulan data yagn lebih besar.Tetapi tidak ad alasan untk berasumsi.Disini hampir pasti itu adalah `ACCESS_TOKEN`, beberapa data yang di simpan dalam `ACCESS_TOKEN`.Satu satunya pilihan lain  disni adalah `auth`,dan sangat mungkin bahwa `auth` ini menyimpan data entah bagaiman atau bahkan hnay di gunakan untuk mengatakan,"Hei user mana yang terkait degn token `auth` ini?",dan itulah car kita akan memperbarui nya.Itu sebenarnnay implementasi yagn cukup aman.Jadi itulah yagn tidak kita harapkan terjadi disini.Tetapi jika kita melihat update,jelas kita memiliki opsi yang sama disini juga,tetapi kemudian kita juga memiliki beberapa value di bawah,dan saya melihat disni ada `email`,ini sangat menarik bagi saya,dan alasnnay adalah ini **mekanisme update**.Data disi seharusnay hanay dat yagn berpotensi di update,tetapi  jika kita kembali melihat  ke halman profile,kita sebenarnya **tidak memiliki** kemampuan untuk update data email ini.Tetapi siapa tahu jika kita mencoba untuk modifikasi `email` di request nya mak itu akan berubah,dan itu bis menjadi contoh validasi input yang tidak memadai,tetapi kita tidak tahu,kita belum mencobanya.

Tetapi salah satu hal yang pasti akan saya uji adalah apakah meraka menyeertakan  ini dsini karena lebih mudah.Tim hanya memilih untuk menggunakan cara yang berbeda daripada yagn mereka lakukna degna route GET dan mereka berkata,"baiklah,mari kita sertakan email saja dan kita akan melakukan pencarian berdasarkan email atau apapun",itulah nilai yagn mereka ambil disana.

IDOR tidak harus menggunakan beberapa jenis  nilai ID untuk mengambil dat kembali,bis berupa jenis data apapun,dan nam pengguna atau email tentu saja merupakan peluang .

Jadi,mari kita kembali ke halman profile dan melihat mekanisme lainnya,disni jug aa mekanisme untuk updat kata sandi,dan kita sebenrany akan membahasnya sekarang karena itu mungkin lebih merupakan cara untk melewati otentikasi.Tapi kita bisa mamasukkn email baru,,mai kita coba masukkna emil baru disana dan say coba masukkna email `<email>`,dan say menankgap request nya.Didalam request nay disni kita masih melihat ada `ACCESS_TOKEN` dan `auth`,sekarnag jika kia lihat bagian bawah nya,disni kita memiliki `NewEmail`,`__RequestVerificationToken`,dan `X-Requested-With`.Jadi kita tahu pasti bahwa email disni tidak di gunakan untuk menemukan meial kita,karena ini adalah emali baru yagn akan di tempatkan,bukan sepeti ada kedauny disana.Jadi anda harus berpikir bahwa sekali lagi  itu mengidentifikasi objek pengguna kita melalui `ACCESS_TOKEN` atau berpoetnasi melalui `auth` token.Jaid kis suh punay mapping lagi untuk mekanismenay seprti ini  **UPDATE = POST -> `/rewards/profile/ChangeEmail`**,disni kita memiliki untuk update email,,sebenarnray tidak maslah apa yagn di update,maksud saya itu berdampak,tetapi bukan utuk apa yagn kita lihat disni.Yang kita cari hanyalah mengidentifiaksi mekanisme yagn berpotensi untk di uji untuk IDOR,dan kemudian langah selanjutnay adalah benar-benar menggali dan mengidentifiasi apa sebenarnay yagn di gunakan nya untuk mengidentifikasi kumpulan data yang lebih besar untuk masing-masing nya.


## Pengujian CRUD


Sekargan Kita sudah memiliki 3 Request di Burp,**READ,UPDATE dan UPDATE**,kita akan mulai dari request Read terlanih dahulu,disni seperti yagn kita sudha tahu,ketika kirm request nay mak akan mengembalikn resprespoinin diman itu mengirikan data pribadi kita,dan kita juda sudah tahu,kalau kita mengahapus `auth` dari header,kita akan di alihkn ke halman login,dan kita tahu juga bahwa tidak ada yagn di validasi dalam `ACCESS_TOKEN`,kita tahu bahwa kita dapat mengirtimkan informasi  apapun.

### Pengujian READ

Sekarang kita dapat terus menguji setiap nilai yang berbeda  ini untuk di coba.Untuk mengetahui token mana yang sedang di gunakan,dan itulah skenario ideal kami,itulah yang kami harapkan.Tapi hal pertama yang harus kita lakukan disni adalah menguji untuk memastikan bahwa `ACCESS_TOKEN` ini benar-benar di gunakan.Tes yang sangat sederhan untuk melakukannay adalah kita dapat menghapunsya dan melihat apa yagn terjadi.Jika kita mengirikn request nay lagi tanpa `ACCESS_TOKEN` ,kita melihat bahwa kita masih mendapatkan respions yagn sama yagn mngirimkn informasi probadi kita.Kita dapat terus menghapus beberapa Header dan lainnya,tetapi kasus yang kurang menguntungakn bagi kita dan kasus yagn menguntungkan bagi Starbucks adalah meskipun tampaknya kita memiliki kerentanan dalam JWT yang tidak di validasi,yang sebenarnnya kit lihat adalah JWT yagn di kirim ke titik akhir ynag sebenarnnay tidak perlu di kirim ke sana.Dan saya ingin memastikan saya menyoroti hal itu terlebih dahulu karean say sering menemui hal itu ketika saya manguji IDOR.

> - Hapus `auth` akan di alihkn ke halman logim
> - tidak ada yagn di validasi dalam `ACCESS_TOKEN`
> - Hapus `ACCESS_TOKEN`, responsenya tetap mengembalikan informasi pribadi kita
> 
Tetapi juga ada banyak sekali waktu ketika saya berbicara dengan peneliliti yang baru memulai,dimana mereka menemukan sesuatu seperti itu,dimana JWT tidak di validasi atau apapun,dan jantung mereka berdebar kencang, mereka berkata "Oh,saya menemukan kerentanan ini" dan semau orang mulai berpikir hal yang sama.meraka mulai berpikir "Oh,bagaiman jika orang lain telah menemukannya?,saya tidak ingin duplikat,saya harus menulis sesuatu",Mereka mulia terburu-buru dan semuanya mulai terlintas di kepala anda dengan sangat cepat.

Saya tidak bisa cukup menekankan ini,setiap kali anda menemukan sesuatu seperti itu,hal terbaik yang dapat anda lakukan adalah menjauh dari komputer sejenak untuk bernafas dan memikirkannya,lalu kembai dan mengujinya dari berbagai sudut yang berbeda.Karena sesuatu seperti ini,sangat mudah bagi kami,saat kami mulai menguji,untuk merasa seperti kami menemukan sesuatu,"Oh,ini kesalahan konfigurasi,mereka tidak memvalidasi token JWT ini",dan ternyata itu sesederhana token JWT tidak perlu di kirim disini.**Tapi itu bukan kerentanan**,mereka mengirimkannay ke sana,itu tidka berdampak sama sekali.Kita bis berasumsi,kita tidak tahu,kita mungkin ingin masuk dan menguji,tetapi tidak pada tahap awal ini.

> JWT tidak di validasi itu bukan berarti kerentanan,itu bisa saja token JWT tidak perlu di kirim ke request

Jadi pada titik ini,saya sangat yakin bahwa car ini di identifikasi melalu **`auth` cookie**,jadi itu adalah skenario terburuk bagi saya sebagai bug bounty hunting.Iini adalah implementasi yagn sangat aman,sekarang ini adalah titik kegagalan tunggal.Jika seseorang dapat memperoleh token ini,mereka dapat masuk dan mulai mengakses data,tetapi itu tidak akan membantu kita untuk pengujian IDOR.Jadi pada titik ini,saya akan melanjutakn dan menghapus tab **READ** di repeater,dan kita dapat melanjutakn  pengujian kita.

### Pengujian UPDATE

Kita beralih ke Request **UPDATE**,jelas hal pertama yang harus kita lakukan adalah menghapus  `ACCESS_TOKEN` dan melakukan pengujian yang sama,apakah kita masih dapat memperbarui profile,dan disini kita masih mendaptakn respinse 200 OK.Jadi sepertinaiy cookie `ACCESS_TOKEN` itu tidak di gunakn sama sekali saat ini.Bukan nberarti tidak di gunakan sama sekali dalam aplikasi,tetap setidaknay tidak dalam rangkaian mekanisem ini.

Sekarang kita tidak yakin apakah token `auth` yang  di validasi disni,karena kita memiliki data tambahn di bawah request ini.Jadi mari kita lihat seberapa  banyak kita dapat meminimalkan ini,seberapa banyak kita dapat menghapusnay.Mari kita coab terlabih dahulu,mari kita hilangkan `email` dari request ini karean sebenarnnay saya akan memberitahu anda hal pertama yang kita lakukan karena kita dapat menguji dua hal sekaligus.Pertama saay akna menambhkan nilai di email,yan sebelumnay nilanya itu `<email>`,saya ka ncoab ganti degan `<email>` dan ktia kirim request nay,,dan disini respinnya  200 ok,dan profile berhasul di perbarui.Sekarang kita dapat melihat apakah email tersebut benar-benar di perbarui.Jadi sekarng kita megnuji IDOR untuk melihat.Saya berasumsi jika itu adalah IDOR,itu akan membari tahu saya bahwa user ini tidak ada.Jadi saya pikir kita sudah mengesampingkan itu dari parameter `email` ini,tetapi kita juga dapat menguji untuk melihat apakh itu benar-benar memeperbarui email ketiak seharusnay tidak.Jadi jika say refresh halaman profile disini dan kita melihat bahwa kita masih mendaptkan email yagn sama dan tidka di perbaui.Jadi mekipun di katakan bahwa profile kita sudah di perbarui,email sebenarnay tidak di modifikasi melalu mekanisme terpisah disana.

Jadi,mari kita lihat,kita bisa melanjutkan dan,anda tahu mungkin saja,hampir pasti tidak akan mengidentifikasi kumpulan data dari nilai apaoun yang dapat kita ubah.Jadi,mari kita lihat ,kita bis menghapsu parameter `email` sepenuhnay dari request,saya tidak melihat banyak pilihan lain,kita bius menhapsu juga parameter `__RequestParameterToken`,saya tidak tahu apakah itu akan berdampak,kita juga akan menghapus parameter `X-Requested-With`,tetapi yagn lainnya hanyalah nilai-nilai biner,dan kita coba ubah nilai dari parameter `FirstName` dengan nilai `test`,dan kita  kirm request lagi,Sangeat menarik,disni kita mendapatakn response "**Unable to update profile**",sepertinay kit telah menghapus sesuatu yagn menyebabkan keruskan.kit akan cari tahu apa parameter yang kita hapsu yagn menyebbkan itu gagal,apakah dari `email`,`__RequestParameterToken` atau `X-Requested-With`. 

Jadi kita harus menyertakan `email`,tetapi ini memungkinkan kita untuk memperbarui nilai.Ini memungkinkan kita untuk memperbarui nilai, apapun email nya.Jadi,apakh itu menghilangkan notasi plus "+" dan itulash alasan kita tidak mendapatkannya??,mari kita coab mengubah `wearehackerone`,atau menambhkn sesuatu di tengah nya dan mangirimkannay.Kita msih mendapatkn profile berhasil di update,dan ini masih baik-baik saja.Jadi,sepertinya nilai `email` ini hanya perlu ada di sana,tetapi mengapa??, jadi itu akan menjadi petunjuk lain.Jadi dsini kita mendaptkan informasi bahwa equest harsu menyertakn parameter `email` di body,tapi tampaknay tidak di memvalidasinya.

> POST Request untuk UPDATE Object ke https://www.starbucks.com.sg/rewards/profile  harus menyertakan parameter `email`,tapi tampaknya tidak memvalidasinya

Saya tidak tau ini artiny apa,Bagaimanapun,kita dapat kembai ke sana nanti.Setidaknya kita telah mengidentifikasinya.Saya cukup yakin bahwa ini menggunakan cookie `auth` .Anda biasnay melihat mekanisme dalam kelompok tertentu menggunakan nilai yagn sama,apapun sebutannya,tidka selalu begitu.Sekali lagi Anda ingin memeriaks semunay ,tetapi itulah yang saya pikirkan,itualh yagn menurut saya terjadi disini.

Satu hal lagi yagn mungkin sya lakukan karena ini adalah request POST,dan saya tidak akan melakuknay sekarang,tetapi mungkin di masa mendatang.Jadi mari kita lakukna ini.

Jadi disni kita sudah mendaptkan inforamsi lain,yaitu

>UPDATE = POST -> `/rewards/profile`
>   - Melalui `auth` cookie
>   - fuzz untuk paremeter tersembungi

Karena ketak anda melalukan pengujian IDOO,anda tahu requese seprt ini mungkin menggunakan token,tetapi mungkin memiliki beberapa lapisan kondisi yang berbeda untuk menentukan ID apa yang sebenarnya akan di gunakn untk mengakses kumpulan data.Jadi,mungkin saya sistem mencoab menggunakan `email` terlebih dahulu,dan jika entah bagaimana tidak di validasi degna benar,maka akan beralih ke token akses.Mungkin ad koe lain di backend yang tidka kita ketahui dimana sisteam akan mencoba mencari nilai lain,misalnya,mencari  nilai `nameid` dan kita dapat memasukannya di sana.Mungkin ada semacam logika diman token akses di periks terlebh dahulu,tetap kemudain harsu di validasi,dan jika tidka di validasi,maka akan beralih ke akses token.Jika demikian,kita dapat menguji kerentanan JWT atau mencoab mendapatkan tand tangan JWT yang valid karena menggunakan HS256 dan ktia dapat melewatinya dengan cara itu.Tetapi kita tidak tahu apakh itu penggunaan waktu yang baik karena token akses itu mungkin hanya cookie lama yagn tidak di gunakn lagi,dan kita manghabiskan banyak waktu untuk mencoba melelwatinay,lalu menemukan bahwa itu tidak berdampak pada aplikasi.Jadi kita perlu melakukn lebih banyja pekerjaan,memahami aplikasi sebelum kita mulai bergerak ke sana.


### Pengujian UPDATE Email

Kita akan beralih lagi ke Request untuk update email,pertama yang akan say lakun adalah membac aresponya dulu,dan di responsn nay kita mendapatkan informasi yang tercermin disana juga.Jadi sepertinya hanya memeriksa apakah itu ada atau tidak.Mari kita coab ubah nilai parameter `NewEmail`  degna menambhkn teks di tengah atau apapun itu,dan kita coab kirim lagi request nya,dan apakh itu memungkinkan kita untuk mengubah nya??,dan apakh itu cocok.Di halaman profile seharunsy ktia akan melihat perubahan.

Jadi apakah email ini pada suatu titik ada kueri basis data yang di gunakan degna email ini??Anda tahu,itu di teruskn di suatu tempat disana untuk mengatakan apakah ini ada atau tidak.Tapi sekali lagi kita tidak tahu apakah itu yang di gunakan untuk benar-benar mengnubah nya.Bahkan hampir pasti bukan itu yang di gunakan untk mengubahnya.Akan ada panggilan lain,sekali lagi saya berasumsi dari cookie `ACCESS_TOKEN` ini.Sekarang kita dapat mengujinay degna menghapus  `ACCESS_TOKEN` dari request,dan disni kita seharusnmay mendaptkan response kalau emili itu sudah ada,dan memang begitu responsnya ketik saya kirim.

Jadi sebagian besar kemungkinan besar yagn terjadi disini sama eperti sebelumnya,ad cookie yagn di gunakn untuk mengidentifikasi user object yang sedang di modifikasi.Kemudain ad panggiaan ke databse untuk memeriksa object tersebut ada,dan ad kondisi untk mengatakan jika objek tersebut ada,kembalikan JSON dengam pesan "kalua email ini udah ada".Jika tidak ada,mari kita perbarui data pengguna atau objek pengguna ini dan simpan kembali ke databse.

Jadi sekali lagi kita memiliki kemungkinan yang sama

>UPDATE = POST -> `/rewards/profile/ChangeEmail`
>   - Melalui `auth` cookie?
>   - fuzz for hidden parameter


Mari kit bahas beberap object yagn telah ktia temukan,kita belum menemukan banyak,bahkan kita belum melihat  satu pun yagn tercermin secara langsung.Ini mungkin yagn paling mendekati pemahaman kita tentang seperti apa objecat pengguna kita.Jadi,disini kit sudah mempunay object sepeti ini

> Object ini bukan object yagn di ambil dari request starbucks,ini di ambil dari meta,karean saya belum belum hunting ke starbuck ketika saya menulis ini

``` json
av=100082986169066&__aaid=0&__user=100082986169066&__a=1&__req=14&__hs=20549.HCSV2:comet_pkg.2.1...0&dpr=1&__ccg=EXCELLENT&__rev=1036716141&__s=4usq1i:beng4r:5s3cu4&__hsi=7625667396748485916&__dyn=7xeUjGU5a5Q1ryaxG4Vp41twWwIxu13wFwhUKbgS3q2ibwNw9G2Sawba1DwUx60GE3Qwb-q7oc81EEc87m221Fwgo9oO0n24oaEnxO0Bo7O2l2Utwqo5W1ywiE4u9x-3m1mzXw8W58jwGzEaE5e3ym2SU4i5oe8cEW4-5pUfEe88o4Wm7-2K0-obUG2-azqwt8eo5d0bS1LyUaUbGxe6Uak0zU8oC1Hg6C13xecwBwWzUlwEKufxamEbbxG1fBG2-0P8461wweW2K3abxG6E2Uwde6E&__csr=l0DMFdk9Pin5Ncv4OsbhvsDi48INpDPHkBhmxnMxAvpfW5Qrqi99idOn2y8G9gS8Hy4LVqilOkVfBsxFBaUhmuZa9iybivGFaGcABKquAEy-5F4-EC-KEGaAyfAqCFdu-h1irWzp4bBiD-FUOueG6qz9VUGfz8BbjjACAxe8gOifUOV8yaUC8iAybyEy8xaiHxvwCUf8jBxprDK10ChUuzkUaophEiyaG4E4G9wJoboCVUkGEhhogxam4F8gCBwTCyEjzoly-i6o99txGEK2qbG18AwFwkVUuxe8xibzEeE8oaolDGXxy2W3mczWx21czWwBBBwIyUnwionx62WU7m6E5B0lUnyE72i1iwTw61UrwmQE0GK0CkhkE-2KqXgCi1eAzU5i5u0MUO1tBxG0JVrg8WwrErzopw3po04wG1IxO03nO00giu0Tk0aOo0wAM2JC81Yw5S80ff81NwcO07o8S4qwOw45x4E08ao0S60bEoyagS9w3t8cP04lw1963SE1Eu01bjw0xVw39i07Jw2go0hvwRg0zFw2zk0y9o0BN2oF3o0jCyJw4hw&__hsdp=ghiQzEMa8hGoGikW2py9mrEj8yCEOq6y3EyFPP8j2EQzriih3a976MlGACiPCkzi6b7iF4agCySh8VO4LIVacNONyMhi-zO7yZMUg4NGkQQ4i19y91cEkfICz4acG7yrENKgxyq8iTqfCaMy8SdhAxIEFwxwNhpx3S810JEQ5iy228KHehIycV3p3rOyQp7zGYgQMjEHQQgWihWp6mEtgwwgwBxV6wOQ15Cx2iogFUOeVyyp8ugggB8U22x6tiF1dGeQ1wc4oCpiwOCwwpkqu250yyoN1y16GEGquhjVOkAq48aE9VESU2oxR7g46i4Q2Nk1xwwG3K3GbxK3C13wMyVAES6o2MCwi8lgrh8kUlx3x68G1owijw9Nola1ixK68uzU29xyU37wjE2Hw8i2y0S85y08Jx6fw4SzU33Aw63w3dU0FG06nU2yw7Zg6u260Bo13E36wNw3Xo0i3w3zUdUvw4hw4nw74wcW0iWE1i80zS1Mo1q8c8d81d8&__hblp=0Ewg88-0yEqwh816Qax-i2q1ogcE3zwCwFzk1Bw9y1LwjErzawqEy2q1Bxe2Kqicxau8wTwiU4K3eq581uE667UOcK1Hwm8fU6Ci58y1IAxu1vwWyUrwVwgUc8K68pwRwuFE4y3am5efBzLx68G7k3C3a5E14EjDxy7E-1Kwf-1ewywcGi17xi0wE5-1oAw4Zzo38xe261UyU2NzU6W223eifxK1hwrU2lwYwsE2xxi3S5U8U8p836zE5C2e2m3C1iwvU5a1vwuU1VE3awXU1kodo6q0j61zwaa5o1rocodeq9gc8dE8o5W3q6E6K0xU36wNw2Noa83Ix60p20aewoU18816Vob83rwgUdVopzUlxmexibwUwr82rw_wXwfO1zyo4u22320zE1apaw52BwZwfu0gi1Po1hE8k2-3i0i24U4O2W1zw&__sjsp=ghiQzEMa8hGoGikW2pyaCrEj8yyj9EqeEyFZL8xcazidJ994cEAsr1mGiV9nClrIQF1t8yh2Apyuh8VO2ePAH8NN54H2v6iV3O7yZMUg4NGkQQ4i19y9y4a53X9EN23qxUwwMyhD8h2WXp84mfz60EEcE88aP0nEbUVafV630wgwh4q3h0j81kQ0Xo1MU2ShQ0y5g22G0hO32bCizopwb2q18xl1J4xjxm4Ehyaw22o-06tUhw&__comet_req=15&fb_dtsg=NAfvrYD0IR__hha815XLIV-e9OwTupR-Q5HJ_N9dcIc84g9QMGYaH6g:40:1775394540&jazoest=25188&lsd=LMmSBF-XsF2TNPzppNPlTS&__spin_r=1036716141&__spin_b=trunk&__spin_t=1775489048&__crn=comet.fbweb.CometGroupRulesRoute&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=useGroupRulesDeleteRuleMutation&server_timestamps=true&variables={"input":{"group_id":"1271694654427555","rule_id":"1272396877690666","actor_id":"100082986169066","client_mutation_id":"1"}}&doc_id=9581825481902432
```
