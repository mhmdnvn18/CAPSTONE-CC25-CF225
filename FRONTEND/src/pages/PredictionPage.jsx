import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PredictionForm from '../components/PredictionForm';
import ApiStatusMonitor from '../components/ApiStatusMonitor';

const PredictionPage = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle successful prediction
  const handlePredictionResult = (result) => {
    console.log('🎯 Prediction result received:', result);
    setPredictionResult(result);
    
    // Store result in sessionStorage for ResultPage
    sessionStorage.setItem('predictionResult', JSON.stringify(result));
    
    // Navigate to result page
    navigate('/result');
  };

  // Handle prediction error
  const handlePredictionError = (error) => {
    console.error('❌ Prediction error in page:', error);
    // Error is already handled in the form component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full shadow-lg mb-4">
            <motion.i 
              className="fas fa-heartbeat text-white text-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Prediksi Risiko Kardiovaskular
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Masukkan data kesehatan Anda untuk mendapatkan prediksi risiko penyakit kardiovaskular 
            menggunakan teknologi AI yang akurat dan terpercaya.
          </p>
        </motion.div>

        {/* API Status Monitor */}
        <div className="max-w-4xl mx-auto mb-6">
          <ApiStatusMonitor />
        </div>

        {/* Prediction Form */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <PredictionForm 
              onResult={handlePredictionResult}
              onError={handlePredictionError}
            />
          </div>
        </motion.div>

        {/* Information Cards */}
        <motion.div 
          className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-shield-alt text-blue-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Data Aman</h3>
            </div>
            <p className="text-gray-600">
              Data Anda dienkripsi dan tidak disimpan secara permanen. Privasi dan keamanan adalah prioritas utama kami.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Hasil Cepat</h3>
            </div>
            <p className="text-gray-600">
              Dapatkan hasil prediksi dalam hitungan detik dengan akurasi tinggi menggunakan algoritma machine learning.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-md text-purple-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 ml-4">Rekomendasi</h3>
            </div>
            <p className="text-gray-600">
              Terima rekomendasi kesehatan yang personal berdasarkan hasil analisis faktor risiko Anda.
            </p>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          className="max-w-4xl mx-auto mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-amber-600 mt-1 mr-3"></i>
              <div className="text-sm text-amber-800">
                <strong>Disclaimer:</strong> Hasil prediksi ini hanya untuk tujuan informasi dan tidak menggantikan 
                konsultasi medis profesional. Selalu konsultasikan dengan dokter untuk diagnosis dan perawatan yang tepat.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionPage;