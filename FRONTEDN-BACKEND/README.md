# CardioPredict

CardioPredict adalah aplikasi web untuk prediksi risiko penyakit kardiovaskular berbasis machine learning. Aplikasi ini memungkinkan pengguna memasukkan data kesehatan dasar dan mendapatkan estimasi risiko secara cepat, mudah, dan privat.

---

## Fitur Utama

- **Prediksi Risiko Kardiovaskular:** Menggunakan model machine learning yang telah dilatih.
- **Input Data Mudah:** Formulir input usia, tinggi, berat, tekanan darah, kolesterol, glukosa, kebiasaan merokok, konsumsi alkohol, dan aktivitas fisik.
- **Hasil Interaktif:** Menampilkan probabilitas risiko, faktor risiko yang terdeteksi, dan rekomendasi kesehatan.
- **Privasi Terjaga:** Data tidak disimpan di server, hanya digunakan untuk prediksi lokal.
- **Tampilan Responsif:** Desain modern berbasis React dan Bootstrap.
- **Export/Cetak Hasil:** Hasil prediksi dapat dicetak atau disimpan.

---

## Struktur Project

```
FRONTEDN-BACKEND/
  public/
    model/
      model.json
      group1-shard1of1.bin
    result.html
  src/
    components/
    pages/
    services/
    utils/
    App.jsx
    main.jsx
    index.css
  index.html
  vite.config.js
  vercel.json
  package.json
  ...
```

---

## Cara Membuat & Menjalankan Web Ini

### 1. Persiapan Awal

- Pastikan sudah terinstall **Node.js** (disarankan versi 18 ke atas) dan **npm**.
- Clone repository ini atau download source code.

### 2. Instalasi Dependency

Masuk ke folder project:

```bash
cd FRONTEDN-BACKEND
npm install
```

### 3. Struktur File Model

Pastikan file model TensorFlow.js (`model.json` dan `group1-shard1of1.bin`) sudah ada di `public/model/`.  
Jika ingin menggunakan model sendiri:
- Latih model di Python (misal dengan Keras), lalu konversi ke format TensorFlow.js menggunakan `tensorflowjs_converter`.
- Letakkan file hasil konversi di `public/model/`.

### 4. Menjalankan Web Secara Lokal

Untuk development (hot reload):

```bash
npm run dev
```

Akses di browser: [http://localhost:3000](http://localhost:3000)

### 5. Build untuk Produksi

Untuk membangun versi produksi (static files):

```bash
npm run build
```

Hasil build ada di folder `dist/`.

### 6. Preview Produksi Secara Lokal

```bash
npm run serve
```

### 7. Deploy ke Vercel

- Deploy folder `FRONTEDN-BACKEND` sebagai root project di Vercel.
- Pastikan file `vercel.json` sudah ada untuk rewrite routing SPA.
- Tidak perlu backend khusus, semua prediksi berjalan di sisi client.

---

## Cara Menggunakan Web

1. **Buka aplikasi di browser.**
2. **Isi semua data kesehatan** pada form yang tersedia.
3. Klik tombol **"Prediksi"**.
4. Hasil prediksi akan muncul, termasuk probabilitas risiko dan faktor risiko yang terdeteksi.
5. Untuk menyimpan/cetak hasil, klik tombol **"Cetak Hasil"** pada halaman hasil.

---

## Catatan Teknis

- Model ML menggunakan TensorFlow.js, input harus sesuai dengan range validasi.
- Semua proses prediksi berjalan di browser, tidak ada data yang dikirim ke server.
- Untuk pengembangan lebih lanjut, sesuaikan validasi, normalisasi, atau model sesuai kebutuhan.

---

## Kontribusi

Silakan fork dan pull request jika ingin berkontribusi atau mengembangkan fitur baru.

---

## Lisensi

MIT License.

---
