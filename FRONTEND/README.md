# IllDetect: Sistem Deteksi Penyakit Kardiovaskular - Frontend

IllDetect adalah aplikasi berbasis web yang menggunakan machine learning untuk memprediksi risiko penyakit kardiovaskular berdasarkan data kesehatan pengguna. Frontend ini dibangun dengan React dan TailwindCSS untuk memberikan pengalaman pengguna yang optimal.

![IllDetect Preview](https://via.placeholder.com/800x400?text=IllDetect+Frontend+Preview)

## Fitur Utama

- **🎯 Prediksi Risiko**: Analisis data kesehatan untuk menilai tingkat risiko kardiovaskular
- **💡 Rekomendasi Personal**: Menerima saran kesehatan yang disesuaikan berdasarkan faktor risiko
- **📱 Progressive Web App**: Dapat diinstal sebagai aplikasi mandiri pada perangkat mobile dan desktop
- **🔄 Kemampuan Offline**: Menggunakan fitur inti tanpa koneksi internet
- **📐 Desain Responsif**: Dioptimalkan untuk semua ukuran perangkat
- **🔒 Privasi Utama**: Data pengguna dijaga keamanannya dengan enkripsi end-to-end

## Teknologi yang Digunakan

- **Frontend**: React 18, React Router DOM
- **Styling**: TailwindCSS
- **Build Tools**: Vite
- **PWA**: Service Worker, Web Manifest
- **Backend Integration**: Hapi.js API, Supabase Database
- **Icons**: Font Awesome

## Instalasi & Development

1. **Clone repositori**:
   ```bash
   git clone https://github.com/username/illdetect.git
   cd CAPSTONE-CC25-CF225/FRONTEND
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env file dengan konfigurasi yang sesuai
   ```

4. **Jalankan development server**:
   ```bash
   npm run dev
   ```

5. **Build untuk produksi**:
   ```bash
   npm run build
   ```

6. **Jalankan frontend dan backend bersamaan**:
   ```bash
   npm run full-dev
   ```

## Struktur Proyek

