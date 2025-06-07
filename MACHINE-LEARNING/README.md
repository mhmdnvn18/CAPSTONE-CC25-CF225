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
