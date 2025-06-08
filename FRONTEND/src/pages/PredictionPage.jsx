import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PredictionForm from '../components/PredictionForm';
import ApiStatusMonitor from '../components/ApiStatusMonitor';

function PredictionPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePredictionResult = (result) => {
    console.log('📊 Prediction result received in PredictionPage:', result);
    
    // Store in sessionStorage before navigating
    sessionStorage.setItem('predictionResult', JSON.stringify(result));
    
    // Navigate to result page
    navigate('/result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* API Status Monitor */}
        <div className="mb-6">
          <ApiStatusMonitor />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center relative shadow-lg">
                <i className="fas fa-heart-pulse text-red-600 text-3xl animate-pulse"></i>
                <div className="absolute inset-0 rounded-full border-4 border-red-600 opacity-0 animate-ping"></div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Prediksi Risiko Kardiovaskular
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Masukkan data kesehatan Anda dengan lengkap dan akurat untuk mendapatkan hasil prediksi yang optimal dan terpercaya menggunakan teknologi AI.
            </p>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-clipboard-list text-white"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Form Pemeriksaan Kesehatan
                  </h2>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-white text-sm">
                  <i className="fas fa-shield-alt"></i>
                  <span>Data Aman & Terenkripsi</span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-info text-blue-600 text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-800 mb-1">Petunjuk Pengisian:</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Isi semua data dengan informasi yang akurat dan terkini</li>
                      <li>• Pastikan tekanan darah dalam kondisi istirahat</li>
                      <li>• Hasil prediksi hanya estimasi, konsultasi dokter untuk diagnosis pasti</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Prediction Form */}
              <PredictionForm onResult={handlePredictionResult} />
            </div>

            {/* Form Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <i className="fas fa-lock text-gray-400"></i>
                  <span>Privasi Anda terlindungi dengan enkripsi SSL</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-clock text-gray-400"></i>
                    <span>Waktu proses: ~2 detik</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="fas fa-chart-line text-gray-400"></i>
                    <span>Akurasi: 85%+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-md text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Konsultasi Dokter</h3>
              <p className="text-gray-600 text-sm">
                Hasil prediksi sebaiknya dikonsultasikan dengan dokter spesialis untuk diagnosis yang akurat.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heartbeat text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Deteksi Dini</h3>
              <p className="text-gray-600 text-sm">
                Prediksi dini membantu pencegahan dan penanganan risiko kardiovaskular sejak awal.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Teknologi AI</h3>
              <p className="text-gray-600 text-sm">
                Menggunakan algoritma machine learning untuk analisis yang komprehensif dan akurat.
              </p>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4 shadow-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart-pulse text-red-600 text-2xl animate-pulse"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Menganalisis Data...</h3>
              <p className="text-gray-600 mb-4">
                Mohon tunggu, sistem sedang memproses data kesehatan Anda dengan algoritma AI
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictionPage;