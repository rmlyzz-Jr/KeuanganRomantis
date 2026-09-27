# Aplikasi Keuangan (PWA)

Aplikasi pencatatan keuangan pribadi: login multi-user, transaksi (dengan lampiran bukti struk + pembacaan otomatis), kelola kategori, dan dashboard grafik. Bisa diinstal seperti aplikasi native di HP, tablet, maupun PC.

## Struktur repo

```
index.html          → tampilan aplikasi (PWA)
manifest.json        → konfigurasi PWA (nama, ikon, warna)
sw.js                 → service worker (biar bisa diinstal & jalan offline-ish)
icons/                → ikon aplikasi
apps-script/Code.gs   → backend (JSON API), dipasang terpisah di Google Apps Script
```

Frontend (folder ini) dan backend (`apps-script/Code.gs`) **di-deploy di tempat berbeda**:
- Frontend → GitHub Pages (statis, gratis)
- Backend → Google Apps Script Web App (yang sudah kamu deploy)

## 1. Deploy frontend ke GitHub Pages

1. Push seluruh isi repo ini (kecuali folder `apps-script/`, itu hanya referensi) ke repo GitHub kamu.
2. Buka **Settings → Pages** di repo tersebut.
3. Source: pilih branch (mis. `main`) dan folder `/ (root)`.
4. Simpan. GitHub akan kasih URL seperti `https://<username>.github.io/<nama-repo>/`.
5. Buka URL itu — aplikasi akan muncul dan otomatis bisa diinstal (lihat bagian Instalasi di bawah).

> Kalau nanti index.html/CSS/JS diubah lagi, naikkan `CACHE_VERSION` di `sw.js` (mis. `keuanganku-v2`) supaya pengguna dapat versi terbaru, bukan versi lama dari cache.

## 2. Backend (Apps Script) — sudah terhubung

`index.html` sudah diarahkan ke Web App yang sudah kamu deploy:
```
https://script.google.com/macros/s/AKfycbxv-I3DlflJ22Qcg-rKexmTIpPGs7MKpc0_mfut0oHtTgFrJ7oTCxEePPtxbQEYyUJ0lg/exec
```
Kalau kamu deploy ulang Apps Script-nya dan URL berubah, cari baris `API_URL` di `index.html` dan ganti dengan URL exec yang baru.

**Penting:** di editor Apps Script, isi `Code.gs` harus pakai versi terbaru (yang mengembalikan JSON, bukan HTML) — ambil dari `apps-script/Code.gs` di repo ini. Setelah update kode, jangan lupa **Deploy → Manage deployments → Edit → New version**.

Kalau nanti mau update fitur bukti struk (OCR), aktifkan dulu **Drive API** di Services (ikon + di editor Apps Script).

## 3. Instalasi di perangkat

**Android (Chrome):** buka URL GitHub Pages → akan muncul banner "Tambahkan ke layar Utama", atau tap menu (⋮) → **Install app** / tombol "⬇️ Install App" di sidebar aplikasi.

**iPhone/iPad (Safari):** buka URL → tombol Share (kotak dengan panah ke atas) → **Add to Home Screen**. (iOS belum mendukung prompt install otomatis seperti Android/desktop.)

**PC/Laptop (Chrome/Edge):** buka URL → klik ikon install (⊕) di address bar, atau tombol "⬇️ Install App" di sidebar. Aplikasi akan buka di jendela sendiri seperti aplikasi biasa.

## 4. Catatan keamanan

- Password di sheet **User** disimpan apa adanya (plain text) — cukup untuk pemakaian pribadi/internal, bukan tingkat production.
- Karena backend berupa Web App publik (siapa saja yang tahu URL bisa mengirim request), pastikan username/password login dijaga kerahasiaannya. Untuk keamanan lebih, pertimbangkan hashing password di kemudian hari.
