import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PredictionResult from '../components/PredictionResult';

function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem('predictionResult');
    
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error('Error parsing stored result:', error);
        navigate('/prediction');
      }
    } else {
      // No result found, redirect to prediction page
      navigate('/prediction');
    }
    
    setLoading(false);
  }, [navigate]);

  const handleNewPrediction = () => {
    // Clear stored result
    sessionStorage.removeItem('predictionResult');
    navigate('/prediction');
  };

  const handleGoHome = () => {
    sessionStorage.removeItem('predictionResult');
    navigate('/');
  };

  const handleShareResult = () => {
    if (navigator.share && result) {
      navigator.share({
        title: 'Hasil Prediksi Risiko Kardiovaskular - IllDetect',
        text: `Hasil prediksi risiko kardiovaskular saya: ${result.level} (${result.percentage}%)`,
        url: window.location.origin
      }).catch(console.error);
    } else {
      // Fallback for browsers without Web Share API
      const shareText = `Hasil prediksi risiko kardiovaskular saya: ${result.level} (${result.percentage}%) via IllDetect`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Hasil berhasil disalin ke clipboard!');
      }).catch(() => {
        alert('Gagal menyalin hasil');
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-heart-pulse text-red-600 text-2xl animate-pulse"></i>
          </div>
          <p className="text-gray-600">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Hasil Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Silakan lakukan prediksi terlebih dahulu</p>
          <button
            onClick={() => navigate('/prediction')}
            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
          >
            Mulai Prediksi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto">
          {/* Header with Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <button
                onClick={handleGoHome}
                className="inline-flex items-center text-red-600 hover:text-red-700 font-medium mb-2"
              >
                <i className="fas fa-home mr-2"></i>
                Kembali ke Beranda
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Hasil Prediksi Anda</h1>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button
                onClick={handleShareResult}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <i className="fas fa-share-alt mr-2"></i>
                Bagikan
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center"
              >
                <i className="fas fa-print mr-2"></i>
                Cetak
              </button>
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-clipboard-check text-red-600 mr-3"></i>
              Hasil Prediksi Risiko Kardiovaskular
            </h2>
            
            <PredictionResult result={result} />
          </div>

          {/* Next Steps Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-route text-blue-600 mr-2"></i>
              Langkah Selanjutnya
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.level === 'Tinggi' ? (
                <>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Segera Konsultasi</h4>
                    <p className="text-red-700 text-sm mb-3">
                      Dengan tingkat risiko tinggi, disarankan untuk segera berkonsultasi dengan dokter spesialis jantung.
                    </p>
                    <a
                      href="tel:119"
                      className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                    >
                      <i className="fas fa-phone mr-2"></i>
                      Hubungi Emergency (119)
                    </a>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Pemeriksaan Lanjutan</h4>
                    <p className="text-blue-700 text-sm">
                      Lakukan pemeriksaan seperti EKG, echocardiography, atau tes darah lengkap.
                    </p>
                  </div>
                </>
              ) : result.level === 'Sedang' ? (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Konsultasi Dokter</h4>
                    <p className="text-yellow-700 text-sm">
                      Diskusikan hasil ini dengan dokter untuk evaluasi lebih lanjut dan rencana pencegahan.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Gaya Hidup Sehat</h4>
                    <p className="text-green-700 text-sm">
                      Mulai menerapkan pola makan sehat dan rutin berolahraga untuk mengurangi risiko.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Pertahankan Kondisi</h4>
                    <p className="text-green-700 text-sm">
                      Terus jaga gaya hidup sehat dan lakukan pemeriksaan rutin tahunan.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Pemeriksaan Berkala</h4>
                    <p className="text-blue-700 text-sm">
                      Lakukan check-up kesehatan secara berkala untuk memantau kondisi jantung.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleNewPrediction}
              className="flex-1 px-6 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition flex items-center justify-center"
            >
              <i className="fas fa-redo mr-3"></i>
              Prediksi Lagi
            </button>
            
            <button
              onClick={handleGoHome}
              className="flex-1 px-6 py-4 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition flex items-center justify-center"
            >
              <i className="fas fa-home mr-3"></i>
              Kembali ke Beranda
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong className="font-semibold">Disclaimer:</strong> Hasil prediksi ini bersifat estimasi dan tidak menggantikan diagnosis dokter. 
                  Konsultasikan hasil ke tenaga medis profesional untuk evaluasi yang lebih komprehensif.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ResultPage; 