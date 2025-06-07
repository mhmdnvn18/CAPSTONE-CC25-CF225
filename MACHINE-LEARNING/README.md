# Penjelasan File dan Struktur Direktori

Berikut adalah penjelasan singkat mengenai file-file utama dalam folder `MACHINE-LEARNING`:

- **IllDetect_Capstone_Project.ipynb**  
  Notebook utama yang berisi seluruh proses analisis data, eksplorasi, pemodelan machine learning, evaluasi, hingga penyimpanan model untuk deteksi risiko penyakit kardiovaskular. Notebook ini memuat penjelasan, kode Python, visualisasi, serta inferensi model.

- **tfjs_model/**  
  Folder ini berisi model hasil pelatihan yang telah dikonversi ke format TensorFlow.js (`model.json` dan file bobot terkait). Model ini dapat digunakan untuk deployment pada aplikasi berbasis web.

- **model_best.h5**  
  File model Keras hasil pelatihan terbaik (format HDF5), disimpan untuk keperluan deployment atau konversi ke format lain.

- **Deskripsi Dataset**  
  Dataset yang digunakan diunduh dari Kaggle (Cardiovascular Disease Dataset) dan diproses dalam notebook. Penjelasan detail mengenai variabel dan proses pengambilan subset data dijelaskan di bagian awal notebook.

> Untuk menjalankan ulang pipeline, pastikan seluruh dependensi (pandas, scikit-learn, tensorflow, pytorch-tabnet, seaborn, matplotlib, dsb) telah terinstal di lingkungan Python Anda.

## Teknologi yang Digunakan

Proyek *IllDetect* mengimplementasikan berbagai teknologi machine learning modern:

### Bahasa Pemrograman dan Libraries
- **Python 3.8+** sebagai bahasa pemrograman utama
- **Pandas & NumPy** untuk manipulasi dan analisis data
- **Matplotlib & Seaborn** untuk visualisasi data
- **Scikit-learn** untuk preprocessing dan evaluasi model
- **TensorFlow/Keras** untuk implementasi model deep learning
- **PyTorch TabNet** untuk implementasi model tabular neural network
- **TensorFlow.js** untuk konversi model ke format web

### Algoritma Machine Learning
- **Multi-Layer Perceptron (MLP)** - Model neural network yang dipilih sebagai model terbaik dengan akurasi 74.95%
- **TabNet** - Model neural network untuk data tabular dengan pendekatan attention-based

### Proses Machine Learning
1. **Data Understanding & Exploratory Data Analysis**
2. **Data Preparation & Feature Engineering**
3. **Model Training & Hyperparameter Optimization** menggunakan GridSearchCV
4. **Model Evaluation** menggunakan metrics seperti accuracy, precision, recall, dan F1-score
5. **Model Export** ke format H5 dan TensorFlow.js untuk deployment

## Cara Penggunaan

### Menjalankan Notebook
1. Pastikan semua dependencies terinstal dengan menjalankan:
   ```bash
   pip install pandas numpy matplotlib seaborn scikit-learn tensorflow pytorch-tabnet kagglehub
   ```
2. Buka notebook `IllDetect_Capstone_Project.ipynb` menggunakan Jupyter Notebook atau Google Colab
3. Jalankan sel secara berurutan untuk mereplikasi proses analisis data hingga pelatihan model

### Menggunakan Model untuk Inferensi
Model dapat digunakan untuk memprediksi risiko penyakit kardiovaskular menggunakan data baru:

```python
# Contoh data pasien baru
new_data_dict = {
    'age': 20440,        # Usia dalam hari (~56 tahun)
    'gender': 1,         # 1=Perempuan, 2=Laki-laki
    'height': 156,       # Tinggi badan (cm)
    'weight': 85,        # Berat badan (kg)
    'ap_hi': 140,        # Tekanan darah sistolik
    'ap_lo': 90,         # Tekanan darah diastolik
    'cholesterol': 3,    # Level kolesterol (1=Normal, 2=Di atas normal, 3=Jauh di atas normal)
    'gluc': 1,           # Level glukosa (1=Normal, 2=Di atas normal, 3=Jauh di atas normal)
    'smoke': 0,          # Status merokok (0=Tidak, 1=Ya)
    'alco': 0,           # Konsumsi alkohol (0=Tidak, 1=Ya)
    'active': 1          # Aktif secara fisik (0=Tidak, 1=Ya)
}

# Proses data dan lakukan prediksi
# (Lihat bagian Inferensi dalam notebook untuk kode lengkap)
```

### Deployment Web dengan TensorFlow.js
Model yang tersimpan dalam format TensorFlow.js dapat diintegrasikan ke aplikasi web:

1. Gunakan folder `tfjs_model/` yang berisi `model.json` dan file weights
2. Load model dalam aplikasi web menggunakan TensorFlow.js:
   ```javascript
   async function loadModel() {
     const model = await tf.loadLayersModel('/path/to/tfjs_model/model.json');
     return model;
   }
   
   async function predict(input) {
     const model = await loadModel();
     const tensor = tf.tensor2d([input]);
     const prediction = model.predict(tensor);
     return prediction.dataSync();
   }
   ```
3. Pastikan data input dinormalisasi sesuai dengan preprocessing yang dilakukan saat training

### Parameter Input Model
Model menerima 11 parameter input yang harus diproses sesuai dengan transformasi yang diterapkan pada data training:

| Parameter    | Deskripsi                              | Nilai                                   |
|--------------|----------------------------------------|-----------------------------------------|
| age          | Usia dalam hari                        | Numeric (standardized)                  |
| gender       | Jenis kelamin                          | 1=Perempuan, 2=Laki-laki               |
| height       | Tinggi badan (cm)                      | Numeric (standardized)                  |
| weight       | Berat badan (kg)                       | Numeric (standardized)                  |
| ap_hi        | Tekanan darah sistolik                 | Numeric (standardized)                  |
| ap_lo        | Tekanan darah diastolik                | Numeric (standardized)                  |
| cholesterol  | Level kolesterol                       | 1=Normal, 2=Di atas normal, 3=Tinggi   |
| gluc         | Level glukosa                          | 1=Normal, 2=Di atas normal, 3=Tinggi   |
| smoke        | Status merokok                         | 0=Tidak, 1=Ya                          |
| alco         | Konsumsi alkohol                       | 0=Tidak, 1=Ya                          |
| active       | Aktif secara fisik                     | 0=Tidak, 1=Ya                          |

### Output Model
Model menghasilkan prediksi biner:
- **0**: Tidak berisiko penyakit kardiovaskular
- **1**: Berisiko penyakit kardiovaskular

Hasil prediksi direpresentasikan sebagai probabilitas (0-1) yang kemudian dikonversi ke label biner dengan threshold 0.5.

### [README.md](file:///c%3A/.Github_mhmdnvn18%40gmail.com/CAPSTONE-CC25-CF225/MACHINE-LEARNING/README.md)

Menambahkan penjelasan lebih detail tentang file machine learning, teknologi yang digunakan, dan cara penggunaannya.
