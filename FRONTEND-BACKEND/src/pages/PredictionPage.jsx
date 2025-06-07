import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PredictionForm from '../components/PredictionForm';

function PredictionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePredictionResult = (predictionResult) => {
    setLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      // Store result in sessionStorage for passing to result page
      sessionStorage.setItem('predictionResult', JSON.stringify(predictionResult));
      
      // Navigate to result page
      navigate('/result');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Kembali ke Beranda
            </button>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center relative">
                  <i className="fas fa-heart-pulse text-red-600 text-3xl animate-pulse"></i>
                  <div className="absolute inset-0 rounded-full border-4 border-red-600 opacity-0 animate-ping"></div>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Prediksi Risiko Kardiovaskular</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Masukkan data kesehatan Anda dengan lengkap dan akurat untuk mendapatkan hasil prediksi yang optimal.
              </p>
            </div>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart-pulse text-red-600 text-2xl animate-pulse"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Menganalisis Data...</h3>
                <p className="text-gray-600 mb-4">Mohon tunggu, sistem sedang memproses data kesehatan Anda</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Prediction Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-clipboard-list text-red-600 mr-3"></i>
              Isi Data Kesehatan Anda
            </h2>
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  <span className="text-sm font-medium text-blue-800">Akurat</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">Pastikan data yang dimasukkan akurat</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-green-600 mr-2"></i>
                  <span className="text-sm font-medium text-green-800">Aman</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Data Anda tidak akan disimpan</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="fas fa-clock text-purple-600 mr-2"></i>
                  <span className="text-sm font-medium text-purple-800">Cepat</span>
                </div>
                <p className="text-xs text-purple-700 mt-1">Hasil dalam hitungan detik</p>
              </div>
            </div>

            <PredictionForm onResult={handlePredictionResult} />
          </div>
          
          {/* Tips Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
              Tips Mengisi Data
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                <div>
                  <h4 className="font-medium text-gray-800">Tekanan Darah</h4>
                  <p className="text-sm text-gray-600">Ukur saat istirahat, normal sekitar 120/80 mmHg</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                <div>
                  <h4 className="font-medium text-gray-800">Kolesterol & Glukosa</h4>
                  <p className="text-sm text-gray-600">Berdasarkan hasil tes darah terbaru Anda</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                <div>
                  <h4 className="font-medium text-gray-800">Aktivitas Fisik</h4>
                  <p className="text-sm text-gray-600">Minimal 30 menit olahraga 3x seminggu = Aktif</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <i className="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                <div>
                  <h4 className="font-medium text-gray-800">Kebiasaan</h4>
                  <p className="text-sm text-gray-600">Jawab jujur tentang merokok dan konsumsi alkohol</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PredictionPage; 