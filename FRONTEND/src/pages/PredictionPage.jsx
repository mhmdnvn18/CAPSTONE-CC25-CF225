import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PredictionForm from '../components/PredictionForm';

const PredictionPage = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  // Handle successful prediction with transition
  const handlePredictionResult = (result) => {
    console.log('🎯 Prediction result received:', result);
    setPredictionResult(result);
    setTransitioning(true);
    
    // Store result in sessionStorage for ResultPage
    sessionStorage.setItem('predictionResult', JSON.stringify(result));
    
    // Add a smooth transition delay before navigation
    setTimeout(() => {
      navigate('/result', { 
        state: { 
          fromPrediction: true,
          result: result 
        } 
      });
    }, 1500);
  };

  // Handle prediction error
  const handlePredictionError = (error) => {
    console.error('❌ Prediction error in page:', error);
    setTransitioning(false);
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
          <motion.p 
            className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Masukkan data kesehatan Anda untuk mendapatkan prediksi risiko penyakit kardiovaskular menggunakan teknologi AI yang akurat dan terpercaya.
          </motion.p>
        </motion.div>

        {/* Prediction Form with Transition Overlay */}
        <motion.div 
          className="max-w-4xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
            {/* Success Transition Overlay */}
            <AnimatePresence>
              {transitioning && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center text-white">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1] 
                      }}
                      transition={{ 
                        rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity }
                      }}
                    >
                      <i className="fas fa-check text-2xl"></i>
                    </motion.div>
                    <motion.h3 
                      className="text-2xl font-bold mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Prediksi Berhasil!
                    </motion.h3>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Memproses hasil dan mengarahkan ke halaman hasil...
                    </motion.p>
                    <motion.div 
                      className="mt-4 flex justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ 
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">⚠️ Disclaimer Medis Penting</h4>
              <div className="space-y-3 text-lg leading-relaxed">
                <p>
                  Hasil estimasi ini merupakan <strong className="text-amber-700">alat bantu skrining awal</strong> yang dikembangkan untuk tujuan edukasi dan informasi kesehatan.
                </p>
                <p>
                  Tool ini <strong className="text-amber-700">TIDAK menggantikan</strong> konsultasi medis profesional, diagnosis dokter, atau pemeriksaan kesehatan komprehensif.
                </p>
                <p className="text-base opacity-90">
                  Selalu konsultasikan hasil dengan dokter spesialis jantung untuk mendapatkan diagnosis yang akurat dan rencana perawatan yang tepat.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictionPage;