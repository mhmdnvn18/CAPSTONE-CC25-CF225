import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        console.log('📊 Loaded result from storage:', parsedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error('Error parsing stored result:', error);
        navigate('/prediction');
      }
    } else {
      console.log('⚠️ No prediction result found in storage');
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">Silakan lakukan prediksi terlebih dahulu.</p>
          <Link
            to="/prediction"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <i className="fas fa-heart-pulse mr-2"></i>
            Mulai Prediksi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Hasil Prediksi Kardiovaskular
            </h1>
            <p className="text-gray-600">
              Berikut adalah hasil analisis risiko berdasarkan data yang Anda berikan
            </p>
          </div>

          {/* Result Component */}
          <PredictionResult result={result} />

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8 no-print">
            <button
              onClick={handleNewPrediction}
              className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <i className="fas fa-redo mr-2"></i>
              Prediksi Ulang
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <i className="fas fa-print mr-2"></i>
              Cetak Hasil
            </button>
            <button
              onClick={handleShareResult}
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <i className="fas fa-share mr-2"></i>
              Bagikan
            </button>
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <i className="fas fa-home mr-2"></i>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;