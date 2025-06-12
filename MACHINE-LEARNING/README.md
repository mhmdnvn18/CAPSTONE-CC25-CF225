# 🗂️ Penjelasan File dan Struktur Direktori

Berikut adalah penjelasan singkat mengenai file-file utama dalam folder `MACHINE-LEARNING`:

- 📒 **IllDetect_Capstone_Project.ipynb**  
  Notebook utama yang berisi seluruh proses analisis data, eksplorasi, pemodelan machine learning, evaluasi, hingga penyimpanan model untuk deteksi risiko penyakit kardiovaskular. Notebook ini memuat penjelasan, kode Python, visualisasi, serta inferensi model.

- 🧩 **my_best_model.h5**  
  File model Keras hasil pelatihan terbaik (format HDF5), disimpan untuk deployment pada Flask API. Model ini dapat dimuat menggunakan `tensorflow.keras.models.load_model()`.

- 📋 **feature_info.pkl**  
  File pickle yang berisi informasi tentang fitur-fitur yang digunakan dalam model, termasuk nama kolom, urutan fitur, dan metadata lainnya yang diperlukan untuk preprocessing data input.

- ⚖️ **scaler.pkl**  
  File pickle yang berisi StandardScaler yang telah di-fit pada data training. Digunakan untuk normalisasi data numerik sebelum prediksi agar konsisten dengan preprocessing saat training.

- 📊 **Deskripsi Dataset**  
  Dataset yang digunakan diunduh dari Kaggle (Cardiovascular Disease Dataset) dan diproses dalam notebook. Penjelasan detail mengenai variabel dan proses pengambilan subset data dijelaskan di bagian awal notebook.

> ⚠️ Untuk menjalankan ulang pipeline, pastikan seluruh dependensi (pandas, scikit-learn, tensorflow, pytorch-tabnet, seaborn, matplotlib, flask, dsb) telah terinstal di lingkungan Python Anda.

## 🚀 Teknologi yang Digunakan

Proyek *IllDetect* mengimplementasikan berbagai teknologi machine learning modern:

### 💻 Bahasa Pemrograman dan Libraries
- 🐍 **Python 3.8+** sebagai bahasa pemrograman utama
- 🐼 **Pandas & NumPy** untuk manipulasi dan analisis data
- 📈 **Matplotlib & Seaborn** untuk visualisasi data
- 🛠️ **Scikit-learn** untuk preprocessing dan evaluasi model
- 🤖 **TensorFlow/Keras** untuk implementasi model deep learning
- 🔥 **PyTorch TabNet** untuk implementasi model tabular neural network
- 🌐 **Flask** untuk deployment model sebagai REST API
- 🥒 **Pickle** untuk serialisasi model artifacts (scaler, feature info)

### 🧠 Algoritma Machine Learning
- 🏆 **Multi-Layer Perceptron (MLP)** - Model neural network yang dipilih sebagai model terbaik dengan akurasi 74.95%
- 🧩 **TabNet** - Model neural network untuk data tabular dengan pendekatan attention-based

### ⚙️ Proses Machine Learning
1. 📊 **Data Understanding & Exploratory Data Analysis**
2. 🧹 **Data Preparation & Feature Engineering**
3. 🏋️ **Model Training & Hyperparameter Optimization** menggunakan GridSearchCV
4. 📝 **Model Evaluation** menggunakan metrics seperti accuracy, precision, recall, dan F1-score
5. 💾 **Model Export** ke format H5 dan pickle untuk deployment Flask API

## Cara Penggunaan

### Menjalankan Notebook
1. Pastikan semua dependencies terinstal dengan menjalankan:
   ```bash
   pip install pandas numpy matplotlib seaborn scikit-learn tensorflow pytorch-tabnet kagglehub flask
   ```
2. Buka notebook `IllDetect_Capstone_Project.ipynb` menggunakan Jupyter Notebook atau Google Colab
3. Jalankan sel secara berurutan untuk mereplikasi proses analisis data hingga pelatihan model

### Menggunakan Model untuk Inferensi
Model dapat digunakan untuk memprediksi risiko penyakit kardiovaskular menggunakan data baru:

```python
import tensorflow as tf
import pickle
import numpy as np

# Load model dan artifacts
model = tf.keras.models.load_model('my_best_model.h5')

# Load scaler dan feature info
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('feature_info.pkl', 'rb') as f:
    feature_info = pickle.load(f)

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

# Preprocessing data sesuai urutan fitur
feature_order = feature_info.get('feature_names', list(new_data_dict.keys()))
new_data = np.array([[new_data_dict[feature] for feature in feature_order]])
new_data_scaled = scaler.transform(new_data)

# Prediksi
prediction = model.predict(new_data_scaled)
risk_probability = prediction[0][0]
risk_label = 1 if risk_probability > 0.5 else 0

print(f"Probabilitas risiko: {risk_probability:.4f}")
print(f"Prediksi: {'Berisiko' if risk_label == 1 else 'Tidak Berisiko'}")
```

### Deployment dengan Flask API
Model dapat di-deploy sebagai REST API menggunakan Flask:

```python
from flask import Flask, request, jsonify
import tensorflow as tf
import pickle
import numpy as np

app = Flask(__name__)

# Load model dan artifacts saat startup
model = tf.keras.models.load_model('my_best_model.h5')

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('feature_info.pkl', 'rb') as f:
    feature_info = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ambil data dari request
        data = request.get_json()
        
        # Validasi input menggunakan feature info
        required_fields = feature_info.get('feature_names', [
            'age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 
            'cholesterol', 'gluc', 'smoke', 'alco', 'active'
        ])
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields', 'required': required_fields}), 400
        
        # Preprocessing sesuai urutan fitur
        input_data = np.array([[data[field] for field in required_fields]])
        input_scaled = scaler.transform(input_data)
        
        # Prediksi
        prediction = model.predict(input_scaled)
        risk_probability = float(prediction[0][0])
        risk_label = int(1 if risk_probability > 0.5 else 0)
        
        return jsonify({
            'risk_probability': risk_probability,
            'risk_label': risk_label,
            'risk_status': 'Berisiko' if risk_label == 1 else 'Tidak Berisiko'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

### Contoh Request ke API
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 20440,
    "gender": 1,
    "height": 156,
    "weight": 85,
    "ap_hi": 140,
    "ap_lo": 90,
    "cholesterol": 3,
    "gluc": 1,
    "smoke": 0,
    "alco": 0,
    "active": 1
  }'
```

### Parameter Input Model
Model menerima 11 parameter input yang harus diproses sesuai dengan transformasi yang diterapkan pada data training:

| Parameter    | Deskripsi                              | Nilai                                   |
|--------------|----------------------------------------|-----------------------------------------|
| age          | Usia dalam hari                        | Numeric (akan di-standardized)         |
| gender       | Jenis kelamin                          | 1=Perempuan, 2=Laki-laki               |
| height       | Tinggi badan (cm)                      | Numeric (akan di-standardized)         |
| weight       | Berat badan (kg)                       | Numeric (akan di-standardized)         |
| ap_hi        | Tekanan darah sistolik                 | Numeric (akan di-standardized)         |
| ap_lo        | Tekanan darah diastolik                | Numeric (akan di-standardized)         |
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

### File Artifacts yang Diperlukan
Untuk deployment, pastikan file-file berikut tersedia:
- `my_best_model.h5` - Model Keras yang telah ditraining
- `scaler.pkl` - StandardScaler untuk normalisasi data numerik
- `feature_info.pkl` - Informasi urutan dan metadata fitur

### [README.md](file:///c%3A/.Github_mhmdnvn18%40gmail.com/CAPSTONE-CC25-CF225/README.md)

Menambahkan penjelasan lebih detail tentang file machine learning, teknologi yang digunakan, dan cara penggunaannya.
