# Wiki untuk Proyek IllDetect

## Daftar Isi
1. [Deskripsi Proyek](#deskripsi-proyek)
2. [Fitur Utama](#fitur-utama)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Instalasi](#instalasi)
5. [Penggunaan](#penggunaan)
6. [API Endpoints](#api-endpoints)
7. [Kontribusi](#kontribusi)
8. [Lisensi](#lisensi)

---

### Deskripsi Proyek
IllDetect adalah aplikasi berbasis web yang menggunakan machine learning untuk memprediksi risiko penyakit kardiovaskular berdasarkan data kesehatan pengguna. Aplikasi ini terdiri dari frontend yang dibangun dengan React dan TailwindCSS, serta backend yang menggunakan Hapi.js dan Supabase.

### Fitur Utama
- **Prediksi Risiko**: Analisis data kesehatan untuk menilai tingkat risiko kardiovaskular.
- **Rekomendasi Personal**: Menerima saran kesehatan yang disesuaikan berdasarkan faktor risiko.
- **Progressive Web App**: Dapat diinstal sebagai aplikasi mandiri pada perangkat mobile dan desktop.
- **Kemampuan Offline**: Menggunakan fitur inti tanpa koneksi internet.
- **Desain Responsif**: Dioptimalkan untuk semua ukuran perangkat.
- **Privasi Utama**: Data pengguna dijaga keamanannya dengan enkripsi end-to-end.

### Teknologi yang Digunakan
- **Frontend**: React 18, React Router DOM, TailwindCSS, Vite
- **Backend**: Hapi.js, Supabase
- **Database**: Supabase
- **Build Tools**: Vite
- **Icons**: Font Awesome

### Instalasi
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
4. Jalankan server:
   ```bash
   npm run dev
   ```

### Penggunaan
Setelah server frontend dan backend berjalan, Anda dapat mengakses aplikasi di `http://localhost:5173`. Ikuti instruksi di aplikasi untuk memasukkan data kesehatan dan mendapatkan prediksi risiko kardiovaskular.

### API Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/health` | Health check dan status database |
| `GET` | `/api/status` | Server status dan informasi sistem |
| `POST` | `/api/predict` | Mengirim data untuk prediksi risiko kardiovaskular |
| `GET` | `/api/predictions` | Mendapatkan riwayat prediksi dengan pagination |
| `GET` | `/api/statistics` | Mendapatkan statistik prediksi |

### Kontribusi
Kami menyambut baik kontribusi dari semua orang. Silakan buka issue atau kirim pull request untuk berkontribusi pada proyek ini.

### Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

---

Anda dapat menambahkan lebih banyak detail, gambar, atau diagram sesuai kebutuhan untuk membuat wiki lebih informatif dan menarik.