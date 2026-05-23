# Analisis DOM Sink pada Predictive Search (Potential XSS Flow)

---

## 1. Sumber Input yang Perlu Dicek

Untuk melakukan tracing alur data, dua titik utama yang harus diperhatikan:

* `window.location`
* `window.location.search`

Parameter URL ini sering menjadi **entry point awal** yang dapat mempengaruhi alur data aplikasi.

---

## 2. Bagian Sink yang Paling Kritis

Kode berikut adalah bagian yang sangat penting:

```js
this.predictiveSearchResults.innerHTML = resultsMarkup;
```

Ini merupakan **DOM sink berisiko tinggi**.

### Kenapa ini berbahaya:

* `innerHTML` → langsung mem-parsing string menjadi DOM
* Jika `resultsMarkup` tidak disanitasi → dapat menjadi jalur injeksi HTML/JS
* Kontrol penuh terhadap struktur HTML bisa terjadi jika input tidak divalidasi

---

## 3. Alur Data (Execution Chain)

Berikut kemungkinan flow data dari input hingga render:

```
window.location.search
        ↓
FacetFiltersForm.searchParamsInitial
        ↓
Request ke server (predictive search endpoint)
        ↓
Response HTML / text (resultsMarkup)
        ↓
DOMParser / processing layer
        ↓
this.predictiveSearchResults.innerHTML = resultsMarkup
```

---

## 4. Apakah Ini XSS?

### Jawaban teknis:

* ❌ Belum bisa dipastikan XSS aktif
* ✔ Tetapi terdapat **indikasi kuat DOM XSS / HTML Injection potential**

---

## 5. Red Flag Utama

Bagian paling penting:

```js
innerHTML = resultsMarkup;
```

Ini adalah:

* ⚠️ DOM sink klasik
* ⚠️ Titik raw rendering tanpa escaping

---

## 6. Risiko yang Mungkin Terjadi

Jika `resultsMarkup` berasal dari user-controlled input:

* HTML injection
* DOM-based XSS
* UI manipulation
* Script execution (dalam kondisi tertentu)

---

## 7. Kesimpulan

Temuan ini menunjukkan:

* Ada **alur data dari URL → request → response → DOM**
* Ada **sink berbahaya (`innerHTML`)**
* Namun masih perlu validasi apakah data benar-benar user-controlled dan tidak disanitasi

👉 Jadi statusnya:

> **Potential DOM XSS (Needs further validation)**
