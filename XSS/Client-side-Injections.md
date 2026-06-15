# Client-side Injections Part II Notes

Source : [Bug Bounty Hunting | Methodology to Bypass Security Controls & Exploit XSS on Real World Targets](https://youtu.be/2IZYwRQ43zw?si=iiD9MY6jFHrg1YUG)

## Reflacted & Stored XSS


### Reflected Attack Vectors 


jika kita melihat url seprit ini,yang diman ada parameter `q`,jadi paramert `q` ini adalah parametr umum untuk pencarian

`https://merch.23andme.com/search?q=<script>alert('XSS')</script>&options%5Bprefix%5D=last`

saya mencoab untuk memasukkna paylaod sederhana seperti `<script>alert('XSS')</script>` dan melihat respinsse nya,,jiak saya mendapattkan `Sorry, you have been blocked`,,maka ini adalah WAF Cloudflare,dan yang memicunay adalah `https://merch.23andme.com/search?q=%3Cscript%3Ealert(%27XSS%27)%3C/script%3E&options%5Bprefix%5D=last`


Selanuyta say akan memeriksa ap ayng terkena dan ap yagn tidaka terkena,,caranay adalah saya coba untuk menghapus  tags `<script>` dan `</script>`,jadi payloadnay sekarng cuma `alert('XSS')`,dan jika tidak di blokir mak ini bagus.

kemudian say mencoab untk menambakan `<>`,jadi payloadnay sekarang `<>alert('XSS')`,dan jika ini juga tidak di blokir,,maka ini adalah hal bagus.

Saya lanjutkan degna menabhkan tags `<script>` dan jadi seperti ini paylaod nya `<script>alert('XSS')`,dan ternyata ini masih di blokir

saya coab lagi dengan `<scr+ipt>`,dan ini amsih di blokir juga 

Seperti yang kita tahu,cloudflare juga memiliki banyak pemblokiran jadi kita dapat mencari cara untuk melewati blokit tersebut.Tetapi disini saya hanya mencoba menyelidiki karena mereka dapat masuk dan mengkonfigurasi ini secara manual berdasarkan beberap hal tertentu.Saya berharap merek memiliki kasus penggunaan dimana karakter khusus perlu lolos sehingga kita berpotensi dapat memecahkannya.

saya coba lagi dengan payload `<scruipt>`,dan jika ini tidak di blokir maka ini bagus


Ngomong-ngomong,kita tidak akan melakukna ini sepanjang hari,kita hanya ingin menyelidiki.Kita mulai mendapatkan gambaran dan mulai melihat polanya,melihat mana yagn ingin kita teliti lebih lanju dan seterusnya.

Selanjutnay  say jgua mencoba untk memasukkan seperti `<img src=x>`,dan ketika saya coba,ini juga tidak di blokir.

saya caob laig seperti ini `<img src=x onerror=alert('XSS');>`,,dan ternyata ini di blokir.


Sejauh ini kita dapat melihat,bahwa dia tidak memeriksa apakah pemblokiran hanya dengan menyertakan tag `<>`,maka itu membuatnay akan jauh lebih sulit,tetap juga sangat sulit untuk melakuknanya.

Sebenarnay disni saya berpikir kalau saya memasukkna payload  `<scruipt>`,itu akn di blokir,tai ternyata tidak,karena mengapa kita perlu mengirim element html lenkgap meskipun bukan eleben sebenarnnya??.Tapi bagaimanpun sepetinya ada celah dalam kontrol kompensasi itu,tetapi jelas ini akan berdampak besar pada kemampuan kita untuk benar-benar mengirimkan payload tersebut.


Selanjuntay kita lanjutkan untukj menyelidiki beberapa kontrol kompensasi lainnya,dan saya coba lagi unutk memasukkan  `<script>alert('XSS')</script>`, hanya untuk memerika beberapa validasi Client-side atau sisi klien.dan disni di blikir  itu berarti tidak,dan ini bagus bagi kita.

Selanjutnay say coba lagi untuk mengimrikna payload hanya `<>` dan saya inspect element untuk melihat apakah payload kita ad disana,san jika itu tidak ada output encoding apapun,kita coba lagi cara lain.kemudian aya mencoba `<1amkaiz3n>`,dan saya periksa di burp,dan disni saya melihat ada canary saya disna sepeti `&lt1amkaiz3n&gt;`,ini artinay output encoding kita ada di beberapa tag html seperti `<title> Search: 0 results found for "&amp;lt;1amkaiz3n&amp;gt;" – The Gene Shop</title>`,,dan juga seprti di kode js seperti `{\"searchResult\":{\"query\":\"\u003c1amkaiz3n\u003e\",\"productVariants\":[]}}]]"});`, jadi disni kita mempunayi Output-encoding berbeda .jadi `session_payload` di tulis dalam DOM,saat itulah kia berbicara tentang persenjataan.Sekali lagi saya berasumsi Session ini dan saya belum masuk,jadi kita perlu mencari tahu apkaha masuk akal untuk masuk.Itu adalah sesuatu aygn akan kita periksa nanti.

Namu ouput encoding nya jelas berbeda disini dari yagn ada di tags `title`,saya asumsikan adalah agar kita tidak dapat ekeluar dari json ini karena satu-satunya karakter yagn akan berfugnsi dalam kasu ini adalah tanda kutip ganda `""`.Kita harus mencari cara untuk memasukan tanda kutip ganda.Sekarang kode untuk yag nmasuk disni cukup menarik.

Dan kit akan kumpukn semunay yang di rasa cukup menarik,seperti di tags `<link rel="canonical" href="https://merch.23andme.com/search?q=%3c1amkaiz3n%3e">`,,tai disni say tidak tahu ap parameter `3c` ini,tetapi kita dapat melihat di output encoding lain bahwa itu di sematkkan.Kemudian kita juga memiliki penyandian hexadecimal disini,jadi mungkin sebenanrnay sangat sulit untuk melakukan itu atau keluar dari situasi ini jika itu berasal dari parameter GET,tetapi kita akan menandi itu juga sebagai output-encoding.

kita juga mendapatkan kalu ini ada di `value `,`<input class="search__input field__input" id="Search-In-Template" type="search" name="q" value="&lt;1amkaiz3n&gt;" placeholder="Search" role="combobox" aria-expanded="false" aria-owns="predictive-search-results" aria-controls="predictive-search-results" aria-haspopup="listbox" aria-autocomplete="list" autocorrect="off" autocomplete="off" autocapitalize="none" spellcheck="false">`,ini bagus sebagai catatan kita,,meskipun saya akan mengatakn bahwa ini akan menjadi attack vektor yang paling teruji secara menyeluruh yang ada.Setiap kali ada mesin pencari atau pencarian apapun dan di lakukan oleh pencarian tersebut tercermin atau reflacted sebagai nilai di bila pencarian sebenarnnya,ini seprti tempat nomer satu yang di uji orang 

kita juga mendapatakn ini `<iframe tabindex="-1" aria-hidden="true" name="web-pixel-sandbox-CUSTOM-shopify-custom-pixel-LAX-5bfe654aw9a31df99pb879ff13m3bd6cd49" src="https://merch.23andme.com/web-pixels@5bfe654aw9a31df99pb879ff13m3bd6cd49/custom/web-pixel-shopify-custom-pixel@0450/sandbox/modern/search?q=%3C1amkaiz3n%3E&amp;options%5Bprefix%5D=last" id="web-pixel-sandbox-CUSTOM-shopify-custom-pixel-LAX-5bfe654aw9a31df99pb879ff13m3bd6cd49" style="height: 0px !important; width: 0px !important; visibility: hidden !important;" sandbox="allow-scripts allow-forms"></iframe>`

kita juga mendaptian disni `<p role="status">No results found for “&quot;&lt;1amkaiz3n&gt;&quot;”. Check the spelling or use a different word or phrase.</p>`,,ini juga merupakn attakc vektor yagn sangat hebat kerena ini berad di tempat terbuka

Sejauh ini kit punya beberpa output encoding berbeda,dan ini bagus karena memberi kita kesempatan untuk mencoba berbagai cara berbeda untuk mengakali ouput-encoding ini.

Dan sejauh ini ksaya belum melihat bukti adanya validasi di sisi server,tetapi itu tentu saja bukan berarti itu tidak ada.Sepertinya output-encodign adalah salah satu hal utama yang mereka andalkan.Dan kita juga harsu melihat `Content Security Policy`


### Kesimpulna yang di dapatkan

> 23andMe.com adalah perusahaan genetika dan bioteknologi asal AS yang menyediakan layanan tes DNA langsung ke konsumen (direct-to-consumer). Dengan sampel air liur, pengguna dapat mengetahui laporan terperinci mengenai leluhur (ancestry), wawasan kesehatan, risiko penyakit genetik, dan karakteristik fisik (traits). 

`https://merch.23andme.com/search?q=shoes&options%5Bprefix%5D=last`
- **WAF**- YES - Cloudflare 
  - `https://merch.23andme.com/search?q=%3Cscript%3Ealert(%27XSS%27)%3C/script%3E&options%5Bprefix%5D=last`
    - Menghapus tags script  = Tidak di block
    - `<>alert('XSS')` = Tidak di blokir
    - `<scruipt>` = Tidak di blokir
    - `<img src=x>` = Tidak di blokir
    - `<img src=x onerror=alert('XSS');>` Di Blokir
  
- **Client-side validation** - Tidak
- **Output-encoding** - YA 
  - `<title> Search: 0 results found for "&amp;lt;1amkaiz3n&amp;gt;" – The Gene Shop</title>`
    - Typical
  - `{\"searchResult\":{\"query\":\"\u003c1amkaiz3n\u003e\",\"productVariants\":[]}}]]"});`
    - Unicode
  - `<link rel="canonical" href="https://merch.23andme.com/search?q=%3c1amkaiz3n%3e">`
    - Hex
  - `value="&lt;1amkaiz3n&gt;"`
    - Typical
  - `<p role="status">No results found for “&quot;&lt;1amkaiz3n&gt;&quot;”. Check the spelling or use a different word or phrase.</p>`
    - Typical
-** Content Security Policy** - Tidak ada
- **Notes**
  - `https://merch.23andme.com/search?q=1amkaiz3n&&options%5Bprefix%5D=last&sc=1amkaiz3n`
    - Parameter `sc`  = 200 Response
  - **Siapa korban?**
    - User 23andme (single customer b2c)
    - User 23andme (single customer b2b)
    - Karyawan/admin 23andme 
  - **Bagaimana kita mengirimkan payload ke korban??**
    - Jika payload dalam parameter GET,dikirimkan melalui phising
  - **Bagaimana cara mempersenjatainya??**



### Eksekusi 

Pada target kita disini,jika kita mampu mendapatkan injeksi client-side untuk mengeksekusi Reflacted XSS,saya yakin kita akan dapat menunjukan bahwa kita akan memiliki banyak peluang  untuk menunjukan dampak.

Sekarang kita akan melihat,siapa saja korban yagn tersedia,apa saja jenia serangan yang dapat kita lakukan dan itulah yagn akn kita lakukna disni.

Namu jika kita lihat dari cara kita mengevaluasi kontrol kopensasi ini,saya rasa mereka telah berfokus pada upaya untuk menghentikan XSS client-side ini sejak awal.Mereka belum menunjukkan banyak minat untuk mencoba mencegahnya di jadikan senjata di kemudian hari.Jadi ,itu menunjukkan kepada saya bahwa jika kita mampu untuk mengakali kontrol ini,

jika kita dapat menemukan cara untuk melewati WAF cloudflare,jika kita dapat menemukan cara untuk membuat output-encoing ini gagal sehingga  sebenarnnya akan menampilkan payload yang valid di DOM,mak kita akan memiliki banyak peluang untuk memanfaatkan dampak tersebut untuk berpotensi mendapatkan sesuatu seperti account takeover,atau apapun.Sekarang kita harsu mencari tahuapakah itu mungkmin,jika memang ada siapa yang akan menjadi korban,akun siapa yang akan kita ambil alih atau takeover??Data apa yagn akan kita dapatkkan disna??Semau itu adalah hal-hal yang harsu kita teliti sekarnag.

Seperti yagn sudah say tulisakn di atas,,disni kita punay 3 kategori korban berbeda yagn bisa kita targetkan dan dampaknya pada para korban ini akan sangat berbeda dari yagn lain karena mereka melakukan B2B atau B2C,jadi itu berarti mereka menjual dari perusahaan ke customer individu,tai mereka juga B2B.Jadi dengan fungsionalitas  B2B ini dan B2C,keta akan memiliki banyak hal tambahn yang perllu di terapkan disini.Dan akan ada banyak peluang lain untuk berpotensi memberika dampak pada bisnis tersebut dengan payload kita.

Sekarang setelah kita memiliki target,**bagaimana kita mengirimkan paylaod itu kepad taret kita?**,dan jawabannya cukup sederhana,yaitu dengan reflacted XSS,kita hanya memiliki satu pilihan,**Payload harus berada di dalam URL dengan cara tertentu** sehingga mereka dapat mengklik link itu atau dapat mengarahkan mereka.Ada beberapa cara lain yagn dapat kita lakukuka,tetapi dalam tulisan ini,mari kita fokus pada itu saja.


Untuk kasus ini,kita akan mencoba memanfaatkan ini untuk mencuri token session yang sudah ada dari sesuatu atau apapun,atau say pikir kita mungkin akan mencoba melakukan serangangan XSS pada subdomain terpisah.Jadi jika kita bisa menjalankan XSS disini,maka kita bisa menemukan core yagn misconfiguration atau mungkin mereka sudah memiliki 2 subdomain berbeda yagn sudah memiliki hubungan kepercayaan di antara keduanya,sehingga kita dapat memaksa user tersebut untuk masuk ke platform yagn sepenihnay terpisah dan mengirimkan request untuk mengubah password mereka atau melakukna seesuatau yagn mungkin tidak mereka lakukan,mungkin mengumpulkan informasi dan kemudian mengirimkannaya melalui email,itu adalah pilihan yagn berbeda.

Jadi kita hasu melakukan banyak penggalian,kita mungkin harus menemukn web client,dan mencari tahu,seperti ap requset tersebut.


Jadi yang perlu kita lakukan adalah mulai mencari tahu bagaiimana cara menangani berbagai output-encoding yang berbeda ini.Jadi say akan masuk ke burp yang diman dengan request ke endpoint search nya,dan mencoab degan melakukan atau menambahkn seprti ini di value dari parameter nya `hfikhjiyiuyjfhkajfhajkhfjhajiweoioy<>"`,i hany random saja,tai yagn terpenting adalah bagian `<>` nya,kita akan memasukkan serangkaian karakter unik yagn say tahu akan saya gunakan untuk melewati output-encoding dan melihat bagaimana sistem menanganinya.

Jadi kita harus  memastikan ini mencakup semau payload kita,kita harsu memasukkan nya ke dalam tag HTML seperti paylaod di `<title>`,dengan cata tertentu,jadi kita membutuhkan `<>`,dan di JSON,kita membutuhkan doule quote ("") untuk keluar dari format  ini,nah bisakah nilai ini di gunakan untuk melakukan XSS DOM Based atau hal lainnya?.Itu juga sesuatu yagn akan kita pertimbangkan ketika kita menggabungkan ini menjadi sebuah metodologi lengkap.Namum untuk sat ini,kita hanya akan fokues ke Reflacted XSS.

Jadi pada dasarnya untuk melewati atau bypass output-encoding apapun,kita perlu membuat salah satu dari 3 ini (`<>"`).Jadi kita kirim send dan lihat bagaiman sistem ini menanganinya

Saya coba input ini juga `https://merch.23andme.com/search?q=1amkaiz3n&sc=1amkaiz3n` di endpint `GET /search?q=hat&options[prefix]=last&sc=TESSC `dan ini hasiny noramal gak d error atau apapn,tai ketika say cari di respinse burp,,ini gak ad yang mengembalik `TESSC`.Kemudian saya cob lagi degna endpinta saya ubah menjadi sepeti ini `GET /search?q=hat&sc=TESSC HTTP/2`,dan saya mendapatkan ini :
`<script id="__st">var __st={"a":67196911836,"offset":-25200,"reqid":"cebde309-36cb-4883-b29e-9ca3763f41da-1776448060","pageurl":"merch.23andme.com\/search?q=hat\u0026sc=TESSC","u":"040d54f58775","cid":9412206854364,"p":"searchresults"};</script>`



## Hasil Eksekusi

Disini say mendaptkan 12 tempat berbeda untuk hasil pencarioin ini,,dan ini haisl saya ketika memasukkan payload `<>"`

- `<link rel="canonical" href="https://merch.23andme.com/search?q=asfadfsgsfsadaa%3c%3e%22">`
- `<title>Search: 0 results found for &quot;asfadfsgsfsadaa&amp;lt;&amp;gt;&quot;&quot;&ndash; The Gene Shop</title>`
- `<meta property="og:url" content="https://merch.23andme.com/search?q=asfadfsgsfsadaa%3c%3e%22">`
- `<meta property="og:title" content="Search: 0 results found for &quot;asfadfsgsfsadaa&amp;lt;&amp;gt;&quot;&quot;">`
- `<meta name="twitter:title" content="Search: 0 results found for &quot;asfadfsgsfsadaa&amp;lt;&amp;gt;&quot;&quot;">`
- `<script id="__st">var __st={"a":67196911836,"offset":-25200,"reqid":"91e3ef35-3560-431e-add5-2e3feca9e469-1776443019","pageurl":"merch.23andme.com\/search?- - - q=asfadfsgsfsadaa%3C%3E%22\u0026options%5Bprefix%5D=last","u":"a4813d166cff","cid":9412206854364,"p":"searchresults"};</script>`
- `"[[\"page_viewed\",{}],[\"search_submitted\",{\"searchResult\":{\"query\":\"asfadfsgsfsadaa\u003c\u003e\\\"\",\"productVariants\":[]}}]]"`
- `{"query":"asfadfsgsfsadaa\u003c\u003e\""},`
- `value="asfadfsgsfsadaa&lt;&gt;&quot;"`
- `value="asfadfsgsfsadaa&lt;&gt;&quot;"`
-` value="asfadfsgsfsadaa&lt;&gt;&quot;"`
- `<p role="status">No results found for “asfadfsgsfsadaa&lt;&gt;&quot;”. Check the spelling or use a different word or phrase.</p>`


### Kesimpulan dari hasil kamu (harus kamu sadari)

Dari 12 titik:
  - `&lt;&gt;&quot;` -> HTML -> ✅ Encoding dilakukan sesuai context,✅ Tidak ada raw injection,❌ Tidak ada breakout
  - `\u003c\u003e\"` -> JSON -> ✅ Encoding dilakukan sesuai context,✅ Tidak ada raw injection,❌ Tidak ada breakout
  - `%3c%3e%22`->  URL -> ✅ Encoding dilakukan sesuai context,✅ Tidak ada raw injection,❌ Tidak ada breakout
  - `value="&lt;&gt;&quot;"`-> Attribute -> ✅ Encoding dilakukan sesuai context,✅ Tidak ada raw injection,❌ Tidak ada breakout
  - `&amp;lt;` -> 💥 DOUBLE ENCODING

Saya coba lagi :
- `GET /search?q=%26lt%3Bsvg%20onload%3Dalert(1)%26gt%3B&options%5Bprefix%5D=last HTTP/2` = `HTTP/2 403 Forbidden`
- `%26lt%3Btest123%26gt%3B` = `200 OK`
  - `<link rel="canonical" href="https://merch.23andme.com/search?q=%26lt%3btest123%26gt%3b">`
  - `<meta property="og:url" content="https://merch.23andme.com/search?q=%26lt%3btest123%26gt%3b">`
  - `<script id="__st">var __st={"a":67196911836,"offset":-25200,"reqid":"8268219d-fa9f-4834-af30-cd27bc4be9a1-1776445602","pageurl":"merch.23andme.com\/search?q=%26lt%3Btest123%26gt%3B\u0026options%5Bprefix%5D=last","u":"0ac6b8760013","cid":9412206854364,"p":"searchresults"};</script>`
- `%26lt%3BabcXYZ123%26gt%3B` = `200 OK`
  - `<link rel="canonical" href="https://merch.23andme.com/search?q=%26lt%3babcxyz123%26gt%3b">`
  -` <meta property="og:url" content="https://merch.23andme.com/search?q=%26lt%3babcxyz123%26gt%3b">`
  -` <script id="__st">var __st={"a":67196911836,"offset":-25200,"reqid":"90816145-3f4f-44ca-b50d-2aadf3548f82-1776445665","pageurl":"merch.23andme.com\/search?q=%26lt%3BabcXYZ123%26gt%3B\u0026options%5Bprefix%5D=last","u":"ac01053b5f08","cid":9412206854364,"p":"searchresults"};</script>`
- ` %26lt%3Btest%22abc%26gt%3B` = 200
  - `<link rel="canonical" href="https://merch.23andme.com/search?q=%26lt%3btest%22abc%26gt%3b">`
  - `<meta property="og:url" content="https://merch.23andme.com/search?q=%26lt%3btest%22abc%26gt%3b">`
  -` <script id="__st">var __st={"a":67196911836,"offset":-25200,"reqid":"7df285e1-cbf5-4fc8-b95d-409819eb3ceb-1776445730","pageurl":"merch.23andme.com\/search?q=%26lt%3Btest%22abc%26gt%3B\u0026options%5Bprefix%5D=last","u":"3221b9fdbe87","cid":9412206854364,"p":"searchresults"};</script>`


👉 Ini kasih kita insight besar:

- 💥 WAF aktif di layer request (pattern-based)
- 💥 Backend tetap menerima entity (&lt;) dengan aman



## DOM Based XSS

🔥 A. DOM-Based XSS (PALING POTENSIAL)

Saya sudah punya ini

`"query":"asfadfsgsfsadaa\u003c\u003e\\\""`

👉 Pertanyaan KRUSIAL: ➡️ Apakah value ini dipakai di JS?

🔍 Cara cek:

  - Di DevTools Console:
    - `window.__st`
      - `Object { a: 67196911836, offset: -25200, reqid: "90ef2822-0b2d-4d00-a491-66661c7a4a4e-1776444902", pageurl: "merch.23andme.com/search?q=hat&options%5Bprefix%5D=last", u: "cf1c76e63e48", cid: 9412206854364, p: "searchresults" }`
    - `document.body.innerHTML.includes("test123")`
      - `false `


⚠️ 2. Tapi ada 1 hal penting (JANGAN DI-SKIP)

`jquery('body').append(content);` = 💥 SINK (tempat eksekusi HTML)

Kenapa ini penting?
  - Kalau content bisa kita kontrol:
    - `jquery('body').append("<svg onload=alert(1)>")`

👉 hasil:
  - 💥 XSS langsung


## Hasli yagn di harapkan
💥 LEVEL 3 — VULNERABLE (ini yang kamu cari)

Contoh:

🔥 HTML breakout
  - `<p>Search: <svg onload=alert(1)></p>`
🔥 Attribute breakout
  - `<input value=""><svg onload=alert(1)>`
🔥 JSON breakout
  - `"query":"";alert(1);//`


### Yang sya temukan 
var __dispatched__=!1,__i__=self.postMessage&&setInterval(function(){if(self.PrivacyManagerAPI&&__i__){var b={PrivacyManagerAPI:{action:"getConsentDecision",timestamp:(new Date).getTime(),self:self.location.host}};self.top.postMessage(JSON.stringify(b),"*");__i__=clearInterval(__i__)}},50);
self.addEventListener("message",function(b,a){try{if(b.data&&(a=JSON.parse(b.data))&&(a=a.PrivacyManagerAPI)&&a.capabilities&&a.action=="getConsentDecision"){var c=self.PrivacyManagerAPI.callApi("getGDPRConsentDecision",self.location.host).consentDecision;c&&!__dispatched__&&(self.dataLayer&&self.dataLayer.push({event:"preferencesLoaded",consentCategories:c}),__dispatched__=!0)}}catch(d){}});
append(Object.assign(document.createElement('input'),{type:'hidden',name:u})),t.elements
!function(o){function n(){var o=[];function n(){o.push(Array.prototype.slice.apply(arguments))}return n.q=o,n}var t=o.Shopify=o.Shopify||{};t.loadFeatures=n(),t.autoloadFeatures=n()}(window);
var __st={"a":67196911836,"offset":-25200,"reqid":"90ef2822-0b2d-4d00-a491-66661c7a4a4e-1776444902","pageurl":"merch.23andme.com\/search?q=hat\u0026options%5Bprefix%5D=last","u":"cf1c76e63e48","cid":9412206854364,"p":"searchresults"};
w[L][v]=w[L][v]||{},w[L][v].q=[],w[L][y]=w[L][y]||{},w[L][y].protect=function(t,e){n(t
src="https://merch.23andme.com/web-pixels@5bfe654aw9a31df99pb879ff13m3bd6cd49/custom/web-pixel-shopify-custom-pixel@0450/sandbox/modern/search?q=hat&options%5Bprefix%5D=last"



Saya cob lagi dgna ini `%2527%2520fokus%253D%2527peringatan%25281%2529%2527%2520`