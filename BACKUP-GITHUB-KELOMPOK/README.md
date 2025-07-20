# Aplikasi Prediksi Risiko Kesehatan

> Aplikasi berbasis React + Vite untuk memprediksi risiko kesehatan berdasarkan parameter input pengguna menggunakan model machine learning TensorFlow.js.

## Fitur Utama

1. **Form Input Prediksi**
   - Formulir lengkap dengan 11 parameter kesehatan
   - Validasi input
   - Tampilan responsif

2. **Model Machine Learning**
   - Menggunakan TensorFlow.js untuk prediksi di browser
   - Model neural network dengan 11 input features
   - Loading model secara async

3. **Teknologi**
   - React.js untuk UI
   - Vite sebagai build tool
   - Tailwind CSS untuk styling

## Instalasi

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```

## Penggunaan

1. Isi semua field pada form prediksi
2. Klik tombol "Prediksi"
3. Hasil prediksi akan ditampilkan

## Struktur Proyek


```
VITE+REACT/
  ├── public/
  │   └── model/          # File model TensorFlow.js
  ├── src/
  │   ├── components/     # Komponen React
  │   │   ├── ErrorBoundary.jsx
  │   │   ├── PredictionForm.jsx
  │   │   └── PredictionResult.jsx
  │   ├── services/       # Layanan model ML
  │   │   ├── api.js
  │   │   └── model.js
  │   ├── pages/          # Halaman aplikasi
  │   ├── utils/          # Utility functions
  │   ├── App.jsx
  │   ├── index.css
  │   └── main.jsx
  ├── package.json
  ├── package-lock.json
  └── vercel.json
```

## Kontribusi

1. Fork project
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

