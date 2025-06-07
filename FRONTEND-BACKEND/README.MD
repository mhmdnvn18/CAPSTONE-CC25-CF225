# IllDetect: Sistem Deteksi Penyakit Kardiovaskular

IllDetect adalah aplikasi berbasis web yang menggunakan machine learning untuk memprediksi risiko penyakit kardiovaskular berdasarkan data kesehatan pengguna. Sistem ini menyediakan antarmuka yang mudah digunakan bagi pengguna untuk memasukkan metrik kesehatan mereka dan menerima hasil penilaian risiko dengan cepat.

![IllDetect Preview](https://via.placeholder.com/800x400?text=IllDetect+Preview)

## Fitur Utama

- **Prediksi Risiko**: Analisis data kesehatan untuk menilai tingkat risiko kardiovaskular
- **Rekomendasi Personal**: Menerima saran kesehatan yang disesuaikan berdasarkan faktor risiko
- **Dukungan PWA**: Dapat diinstal sebagai aplikasi mandiri pada perangkat mobile dan desktop
- **Kemampuan Offline**: Menggunakan fitur inti tanpa koneksi internet
- **Desain Responsif**: Dioptimalkan untuk semua ukuran perangkat
- **Privasi Utama**: Semua pemrosesan terjadi secara lokal, tidak ada data yang dikirim ke server

## Teknologi yang Digunakan

- **Frontend**: React, TailwindCSS
- **Machine Learning**: TensorFlow.js
- **PWA**: Service Worker, Web Manifest
- **Build Tools**: Vite

## Instalasi

1. Clone repositori:
   ```bash
   git clone https://github.com/username/illdetect.git
   cd illdetect
   ```

2. Instal dependensi:
   ```bash
   npm install
   # atau menggunakan yarn
   yarn install
   ```

3. Jalankan server pengembangan:
   ```bash
   npm run dev
   # atau menggunakan yarn
   yarn dev
   ```

4. Build untuk produksi:
   ```bash
   npm run build
   # atau menggunakan yarn
   yarn build
   ```

## Panduan Penggunaan

1. **Halaman Beranda**: Pelajari tentang aplikasi dan fitur-fiturnya
2. **Form Prediksi**: Masukkan data kesehatan Anda termasuk:
   - Usia, jenis kelamin, tinggi, dan berat badan
   - Tekanan darah sistolik dan diastolik
   - Level kolesterol dan glukosa
   - Faktor gaya hidup (merokok, konsumsi alkohol, aktivitas fisik)
3. **Halaman Hasil**: Lihat penilaian risiko dan rekomendasi
   - Tingkat risiko (Rendah, Sedang, Tinggi)
   - Skor persentase risiko
   - Faktor risiko yang teridentifikasi
   - Rekomendasi yang dipersonalisasi

## Instalasi PWA

IllDetect dapat diinstal sebagai Progressive Web App:

1. Kunjungi aplikasi di Chrome, Edge, atau browser lain yang mendukung
2. Cari ikon instalasi di bilah alamat atau menu tiga titik
3. Klik "Instal IllDetect" untuk menambahkannya ke layar utama atau desktop
4. Gunakan aplikasi seperti aplikasi native, bahkan dalam keadaan offline

## Deployment

Aplikasi dapat di-deploy ke berbagai layanan hosting:

- **Vercel**: Direkomendasikan untuk deployment yang lancar
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**: 
  ```bash
  npm install -g netlify-cli
  netlify deploy
  ```

- **GitHub Pages**: Deploy folder `dist` setelah building

## Pengembangan

### Struktur Proyek
- **public/**: File statis seperti `index.html`, ikon, dan manifest untuk PWA.
- **src/**: Kode sumber untuk aplikasi React.
  - **components/**: Komponen React yang dapat digunakan kembali.
  - **pages/**: Komponen halaman untuk routing.
  - **services/**: Layanan API dan integrasi model ML.
  - **App.jsx**: Komponen utama app dengan routing.
  - **main.jsx**: Entry point untuk React, merender komponen App.

### Model Machine Learning
- Model machine learning dikembangkan menggunakan TensorFlow dan Keras, dilatih pada dataset penyakit kardiovaskular.
- Model dikonversi ke format TensorFlow.js dan dimuat langsung di browser.

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detailnya.
