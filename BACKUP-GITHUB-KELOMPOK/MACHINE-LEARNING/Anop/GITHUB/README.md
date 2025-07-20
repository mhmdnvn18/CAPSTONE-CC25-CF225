# Multi-Layer Perceptron untuk Prediksi Risiko Penyakit Kardiovaskular

Model ini adalah neural network (MLP) yang dilatih untuk memprediksi risiko penyakit kardiovaskular berdasarkan data klinis seperti usia, tekanan darah, kolesterol, dan faktor gaya hidup. Model dibangun, dievaluasi, dan dikonversi ke format TensorFlow.js agar dapat digunakan di aplikasi web.

## Struktur Folder

```
Best Model ML/
├── README.md
├── MLP.ipynb                # Notebook proses training, evaluasi, dan konversi model
├── tfjs_model/              # Folder model TensorFlow.js
│   ├── model.json           # Arsitektur & metadata model untuk TensorFlow.js
│   └── group1-shard1of1.bin # Bobot model (binary)
└── web/
    └── index.html           # Website sederhana untuk prediksi risiko (integrasi tfjs)
```

## Cara Cepat Menggunakan Website Prediksi

1. **Pastikan Struktur Folder:**
   ```
   Best Model ML/
   ├── tfjs_model/
   │   ├── model.json
   │   └── group1-shard1of1.bin
   └── web/
       └── index.html
   ```

2. **Isi Nilai Mean dan Std pada index.html:**
   - Buka file `web/index.html`.
   - Temukan bagian:
     ```js
     const scalerMean = [/* ... */];
     const scalerStd = [/* ... */];
     ```
   - Ganti dengan nilai dari `scaler.mean_` dan `scaler.scale_` hasil training di Python.
   - Untuk mendapatkan nilai scaler di Python:
     ```python
     print("Mean:", scaler.mean_)
     print("Std:", scaler.scale_)
     ```

3. **Jalankan Website Secara Lokal:**
   - Buka folder `web/`.
   - Klik dua kali `index.html` atau gunakan Live Server (VSCode).
   - Jika browser memblokir akses file lokal, gunakan:
     ```
     cd path/ke/Best Model ML/web
     python -m http.server
     ```
     Lalu buka `http://localhost:8000` di browser.

4. **Input Data dan Prediksi:**
   - Isi form data klinis pada website.
   - Klik tombol "Prediksi".
   - Hasil prediksi risiko akan muncul di bawah form.

---

## Penjelasan File Model TensorFlow.js

- **model.json**: Arsitektur model, konfigurasi pelatihan, dan referensi ke file bobot.
- **group1-shard1of1.bin**: Bobot (weights) model dalam format biner.
- **MLP.ipynb**: Notebook proses training, preprocessing, evaluasi, dan konversi model ke TensorFlow.js.

---

## Catatan Penting

- Website melakukan preprocessing (standarisasi fitur numerik) sesuai training Python.
- Nilai mean dan std scaler harus diisi manual di `index.html` agar hasil prediksi konsisten.
- Model menerima 11 fitur input (5 numerik, 6 kategorikal) dan output klasifikasi biner (sigmoid).

---

## Contoh Load Model di TensorFlow.js

```js
import * as tf from '@tensorflow/tfjs';
const model = await tf.loadLayersModel('path/to/model.json');
// Lakukan inferensi dengan model
```

---
**Lisensi:**  
Model dan kode ini untuk keperluan edukasi dan non-komersial.
