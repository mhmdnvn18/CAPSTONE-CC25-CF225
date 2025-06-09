# IllDetect Wiki

## Daftar Isi
- [Deskripsi Proyek](#deskripsi-proyek)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [API Endpoints](#api-endpoints)
- [Struktur Proyek](#struktur-proyek)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Deskripsi Proyek
IllDetect adalah aplikasi berbasis web yang menggunakan machine learning untuk memprediksi risiko penyakit kardiovaskular berdasarkan data kesehatan pengguna. Aplikasi ini terdiri dari frontend yang dibangun dengan React dan TailwindCSS, serta backend yang menggunakan Hapi.js.

## Fitur Utama
- **Prediksi Risiko**: Analisis data kesehatan untuk menilai tingkat risiko kardiovaskular.
- **Rekomendasi Personal**: Menerima saran kesehatan yang disesuaikan berdasarkan faktor risiko.
- **Progressive Web App**: Dapat diinstal sebagai aplikasi mandiri pada perangkat mobile dan desktop.
- **Kemampuan Offline**: Menggunakan fitur inti tanpa koneksi internet.
- **Desain Responsif**: Dioptimalkan untuk semua ukuran perangkat.
- **Privasi Utama**: Data pengguna dijaga keamanannya dengan enkripsi end-to-end.

## Teknologi yang Digunakan
- **Frontend**: React 18, React Router DOM, TailwindCSS, Vite
- **Backend**: Hapi.js, Supabase
- **Database**: Supabase
- **Build Tools**: Vite
- **PWA**: Service Worker, Web Manifest

## Instalasi
### Frontend
1. Clone repositori:
   ```bash
   git clone https://github.com/username/illdetect.git
   cd FRONTEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```

### Backend
1. Clone repositori:
   ```bash
   git clone https://github.com/username/illdetect.git
   cd BACKEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
4. Jalankan server:
   ```bash
   npm run dev
   ```

## Penggunaan
Setelah server frontend dan backend berjalan, buka browser dan akses `http://localhost:5173` untuk menggunakan aplikasi. Anda dapat melakukan prediksi risiko penyakit kardiovaskular dengan mengisi data kesehatan yang diperlukan.

## API Endpoints
### Health Check
- **GET** `/api/health`: Memeriksa status kesehatan API.

### Submit Prediction
- **POST** `/api/predict`: Mengirim data untuk prediksi risiko kardiovaskular.

### Get Predictions
- **GET** `/api/predictions`: Mendapatkan riwayat prediksi dengan pagination.

### API Status
- **GET** `/api/status`: Mendapatkan status server dan informasi sistem.

## Struktur Proyek
```
CAPSTONE-CC25-CF225/
├── BACKEND/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── FRONTEND/
    ├── src/
    ├── public/
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## Kontribusi
Jika Anda ingin berkontribusi pada proyek ini, silakan fork repositori ini dan buat pull request. Pastikan untuk mengikuti pedoman kontribusi yang telah ditetapkan.

## Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.

---

Anda dapat menambahkan lebih banyak detail, gambar, atau diagram sesuai kebutuhan untuk membuat wiki lebih informatif dan menarik.