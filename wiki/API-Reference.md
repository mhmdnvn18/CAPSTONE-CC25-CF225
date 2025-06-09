# Wiki untuk Proyek IllDetect

## 1. Deskripsi Proyek
**IllDetect** adalah aplikasi berbasis web yang menggunakan machine learning untuk memprediksi risiko penyakit kardiovaskular berdasarkan data kesehatan pengguna. Aplikasi ini terdiri dari frontend yang dibangun dengan React dan TailwindCSS, serta backend yang menggunakan Hapi.js.

## 2. Fitur Utama
- **Prediksi Risiko**: Menganalisis data kesehatan untuk menilai tingkat risiko kardiovaskular.
- **Rekomendasi Personal**: Memberikan saran kesehatan yang disesuaikan berdasarkan faktor risiko.
- **Progressive Web App**: Dapat diinstal sebagai aplikasi mandiri pada perangkat mobile dan desktop.
- **Kemampuan Offline**: Menggunakan fitur inti tanpa koneksi internet.
- **Desain Responsif**: Dioptimalkan untuk semua ukuran perangkat.
- **Privasi Utama**: Data pengguna dijaga keamanannya dengan enkripsi end-to-end.

## 3. Arsitektur Proyek
### 3.1. Frontend
- **Teknologi**: React, TailwindCSS, Vite
- **Struktur Folder**:
  ```
  FRONTEND/
  ├── public/
  ├── src/
  │   ├── components/
  │   ├── pages/
  │   ├── services/
  │   ├── utils/
  │   └── App.jsx
  ├── index.html
  └── package.json
  ```

### 3.2. Backend
- **Teknologi**: Hapi.js, Supabase
- **Struktur Folder**:
  ```
  BACKEND/
  ├── routes/
  │   ├── health.js
  │   └── prediction.js
  ├── .env.example
  ├── server.js
  └── package.json
  ```

## 4. Instalasi
### 4.1. Frontend
1. Clone repositori:
   ```bash
   git clone https://github.com/username/illdetect.git
   cd FRONTEND
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```

### 4.2. Backend
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

## 5. API Endpoints
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/health` | Health check dan status database |
| `GET` | `/api/status` | Status server dan informasi sistem |
| `POST` | `/api/predict` | Mengirim data untuk prediksi risiko kardiovaskular |
| `GET` | `/api/predictions` | Mendapatkan riwayat prediksi dengan pagination |

## 6. Kontribusi
Jika Anda ingin berkontribusi pada proyek ini, silakan fork repositori ini dan kirim pull request dengan perubahan yang Anda buat.

## 7. Lisensi
Proyek ini dilisensikan di bawah MIT License. Lihat file [LICENSE](LICENSE) untuk informasi lebih lanjut.

## 8. Kontak
Untuk pertanyaan lebih lanjut, silakan hubungi tim pengembang di [email@example.com].

---

Anda dapat menambahkan lebih banyak detail atau bagian sesuai kebutuhan proyek Anda. Pastikan untuk memperbarui tautan dan informasi kontak dengan yang sesuai.