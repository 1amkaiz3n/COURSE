# Threat Modeling dalam Security Engineering (Komponen, Struktur, dan Aplikasi Sistem)

---

## Pengertian Threat Modeling

Threat modeling adalah proses analisis sistem yang digunakan untuk **mengidentifikasi, memahami, dan memetakan ancaman terhadap suatu aplikasi atau infrastruktur**.

Model ini membantu menjawab pertanyaan penting seperti:

* Ancaman apa saja yang mungkin terjadi?
* Bagaimana cara kerja ancaman tersebut di dalam sistem?
* Dari mana ancaman bisa masuk?
* Komponen apa saja yang terdampak?
* Bagaimana cara mitigasinya?

---

## Tujuan Threat Modeling

Tujuan utamanya adalah untuk membangun pemahaman sistem secara menyeluruh agar kita bisa:

* Mengidentifikasi potensi ancaman sejak awal
* Memahami alur serangan (attack surface)
* Menentukan titik lemah sistem
* Menyusun strategi mitigasi yang tepat
* Meningkatkan desain keamanan sistem

---

## Komponen Utama Threat Modeling

Secara umum, threat modeling terdiri dari 4 komponen utama:

---

### 1. Actor (Aktor)

Aktor adalah semua entitas yang berinteraksi dengan sistem.

**Contoh:**

* User
* Admin
* Attacker
* Webmaster
* Third-party service
* Payment provider

Aktor merepresentasikan **siapa yang melakukan aksi terhadap sistem**.

---

### 2. Flow (Alur Data)

Flow adalah jalur komunikasi atau perpindahan data antar komponen sistem.

**Contoh:**

* Login request
* API request
* Cookie
* Token
* File upload
* Webhook

Flow biasanya digambarkan dengan **panah (→)** dalam diagram.

---

### 3. Subject (Komponen Sistem)

Subject adalah objek atau komponen di dalam sistem yang memproses atau menyimpan data.

Subject terbagi menjadi dua jenis:

#### a. Process

Komponen yang memproses data.

**Contoh:**

* Frontend
* Backend API
* Authentication service
* Queue worker

#### b. Store

Tempat penyimpanan data.

**Contoh:**

* Database
* Redis
* Session storage
* Object storage

Subject biasanya digambarkan sebagai **node atau kotak** dalam diagram.

---

### 4. Boundary (Batas Kepercayaan)

Boundary adalah garis pemisah antara level kepercayaan atau privilege dalam sistem.

**Contoh:**

* Public ↔ Internal system
* Guest ↔ Authenticated user
* User ↔ Admin
* Internet ↔ Private network

Boundary menunjukkan **di mana trust level berubah**, sehingga sering menjadi titik rawan security issue.

---

## Representasi Threat Modeling

Threat modeling biasanya divisualisasikan dalam bentuk diagram yang terdiri dari:

* Node (Actor, Subject)
* Flow (data movement)
* Boundary (trust separation)

---

## Area Penerapan Threat Modeling

Threat modeling dapat digunakan di berbagai jenis sistem, seperti:

* Web application
* Mobile application
* Cloud infrastructure
* Microservices architecture
* Distributed systems
* IoT systems
* Network security
* API-based systems

---

## Kesimpulan

Threat modeling adalah fondasi penting dalam security engineering karena membantu kita memahami:

* bagaimana sistem bekerja
* bagaimana data mengalir
* di mana potensi serangan terjadi
* bagaimana cara mengamankan sistem secara struktural

---

### 📌 Intinya:

Threat modeling bukan sekadar diagram, tapi cara berpikir untuk memahami sistem dari perspektif penyerang dan defender secara bersamaan.
