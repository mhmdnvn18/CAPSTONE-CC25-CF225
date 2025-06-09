# Wiki untuk IllDetect

## Daftar Isi
1. [Deskripsi Proyek](#deskripsi-proyek)
2. [Fitur Utama](#fitur-utama)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Instalasi](#instalasi)
5. [Penggunaan](#penggunaan)
6. [API Endpoints](#api-endpoints)
7. [Kontribusi](#kontribusi)
8. [Lisensi](#lisensi)

## Deskripsi Proyek
IllDetect adalah aplikasi berbasis web yang menggunakan machine learning untuk memprediksi risiko penyakit kardiovaskular berdasarkan data kesehatan pengguna. Aplikasi ini terdiri dari frontend yang dibangun dengan React dan TailwindCSS, serta backend yang menggunakan Hapi.js dan Supabase.

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
- **Icons**: Font Awesome

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
4. Jalankan development server:
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

## Kontribusi
Kami menyambut kontribusi dari siapa saja! Jika Anda ingin berkontribusi, silakan fork repositori ini dan buat pull request dengan perubahan yang Anda buat.

## Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

Anda dapat menambahkan lebih banyak detail atau bagian lain sesuai kebutuhan proyek Anda. Pastikan untuk memperbarui tautan dan informasi yang relevan sebelum mempublikasikan wiki ini.