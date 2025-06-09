# IllDetect Wiki

## Daftar Isi
- [Deskripsi Proyek](#deskripsi-proyek)
- [Fitur Utama](#fitur-utama)
- [Arsitektur Proyek](#arsitektur-proyek)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [API](#api)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

## Deskripsi Proyek
IllDetect adalah aplikasi berbasis web yang menggunakan teknologi machine learning untuk memprediksi risiko penyakit kardiovaskular berdasarkan data kesehatan pengguna. Proyek ini terdiri dari frontend yang dibangun dengan React dan TailwindCSS, serta backend yang menggunakan Hapi.js dan Supabase.

## Fitur Utama
- **Prediksi Risiko**: Menganalisis data kesehatan untuk menilai tingkat risiko kardiovaskular.
- **Rekomendasi Personal**: Memberikan saran kesehatan yang disesuaikan berdasarkan faktor risiko.
- **Progressive Web App**: Dapat diinstal sebagai aplikasi mandiri pada perangkat mobile dan desktop.
- **Kemampuan Offline**: Menggunakan fitur inti tanpa koneksi internet.
- **Desain Responsif**: Dioptimalkan untuk semua ukuran perangkat.
- **Privasi Utama**: Data pengguna dijaga keamanannya dengan enkripsi end-to-end.

## Arsitektur Proyek
Proyek ini terdiri dari dua bagian utama:
1. **Frontend**: Menggunakan React untuk antarmuka pengguna dan TailwindCSS untuk styling.
2. **Backend**: Menggunakan Hapi.js untuk API dan Supabase sebagai database.

### Diagram Arsitektur
*(Tambahkan diagram arsitektur jika ada)*

## Instalasi

### Prerequisites
- Node.js >= 16.0.0
- npm >= 7.0.0
- Supabase account dan project

### Langkah-langkah Instalasi

#### Frontend
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

#### Backend
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
Setelah server frontend dan backend berjalan, buka browser dan akses:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5001`

## API
API yang tersedia di backend:
- **GET** `/api/health`: Memeriksa kesehatan API.
- **GET** `/api/status`: Menampilkan status server.
- **POST** `/api/predict`: Mengirim data untuk prediksi risiko kardiovaskular.
- **GET** `/api/predictions`: Mengambil riwayat prediksi.

### Contoh Penggunaan API
```bash
curl -X POST http://localhost:5001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 60, "gender": 2, "height": 170, "weight": 70, "ap_hi": 130, "ap_lo": 80, "cholesterol": 1, "gluc": 1, "smoke": 0, "alco": 0, "active": 1}'
```

## Kontribusi
Kami menyambut baik kontribusi dari semua orang. Silakan buka issue atau kirim pull request untuk berkontribusi pada proyek ini.

## Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

Anda dapat menambahkan lebih banyak detail, gambar, atau diagram sesuai kebutuhan untuk membuat wiki lebih informatif dan menarik.