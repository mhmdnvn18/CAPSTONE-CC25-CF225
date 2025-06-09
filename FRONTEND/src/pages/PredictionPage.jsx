import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PredictionForm from '../components/PredictionForm';
import ApiStatusMonitor from '../components/ApiStatusMonitor';

function PredictionPage() {
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showTips, setShowTips] = useState(false);
  const navigate = useNavigate();
  
  // Tips for accurate prediction
  const healthTips = [
    "Masukkan data tekanan darah setelah beristirahat minimal 5 menit",
    "Ukur berat dan tinggi badan dengan akurat untuk hasil BMI yang tepat",
    "Jika merokok, masukkan jumlah rokok yang Anda konsumsi per hari",
    "Pastikan Anda memasukkan nilai kolesterol sesuai hasil pemeriksaan terakhir"
  ];

  // Process form data and handle submission
  const handleFormUpdate = (data, step) => {
    setFormData({...formData, ...data});
    if (step) setActiveStep(step);
  };

  const handlePredictionResult = (result) => {
    setLoading(true);
    console.log('📊 Prediction result received in PredictionPage:', result);
    
    // Store in sessionStorage before navigating
    sessionStorage.setItem('predictionResult', JSON.stringify(result));
    sessionStorage.setItem('formData', JSON.stringify(formData));
    
    // Simulate loading for better UX
    setTimeout(() => {
      setLoading(false);
      // Navigate to result page
      navigate('/result');
    }, 1500);
  };

  // Section animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-red-200 blur-3xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-200 blur-3xl"
          animate={{ 
            x: [0, -30, 0], 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* API Status Monitor */}
        <div className="mb-6">
          <ApiStatusMonitor />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8">
          <motion.div 
            className="bg-red-50 rounded-full p-4 inline-block mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="w-16 h-16 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center relative shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <i className="fas fa-heartbeat text-white text-3xl"></i>
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-red-500"
                animate={{ opacity: [0, 0.8, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Prediksi Risiko Kardiovaskular
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Masukkan data kesehatan Anda untuk mendapatkan prediksi risiko penyakit kardiovaskular menggunakan teknologi AI.
          </motion.p>
          
          {/* Tips button */}
          <motion.button
            onClick={() => setShowTips(!showTips)}
            className="mt-4 text-red-600 text-sm font-medium flex items-center mx-auto hover:text-red-700"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={`fas fa-${showTips ? 'eye-slash' : 'lightbulb'} mr-2`}></i>
            {showTips ? 'Sembunyikan Tips' : 'Lihat Tips Pengisian'}
          </motion.button>
          
          {/* Health Tips */}
          <AnimatePresence>
            {showTips && (
              <motion.div 
                className="mt-4 bg-blue-50 p-4 rounded-xl max-w-2xl mx-auto border border-blue-100"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                  <i className="fas fa-info-circle mr-2"></i>
                  Tips untuk Hasil Prediksi Akurat:
                </h3>
                <ul className="text-blue-700 text-sm space-y-2">
                  {healthTips.map((tip, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <i className="fas fa-check-circle mt-1 mr-2 text-blue-500"></i>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Form Container */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Step Indicator */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-clipboard-check text-white"></i>
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
              
              {/* Step Progress Bar */}
              <div className="mt-4 bg-white bg-opacity-20 h-2 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white rounded-full"
                  initial={{ width: '33.33%' }}
                  animate={{ width: `${activeStep * 33.33}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              {/* Step Labels */}
              <div className="flex justify-between mt-2 text-xs text-white">
                <div className={`${activeStep >= 1 ? 'text-white' : 'text-white text-opacity-60'}`}>
                  <i className="fas fa-user-circle mr-1"></i> Data Diri
                </div>
                <div className={`${activeStep >= 2 ? 'text-white' : 'text-white text-opacity-60'}`}>
                  <i className="fas fa-stethoscope mr-1"></i> Data Kesehatan
                </div>
                <div className={`${activeStep >= 3 ? 'text-white' : 'text-white text-opacity-60'}`}>
                  <i className="fas fa-heartbeat mr-1"></i> Hasil Prediksi
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {/* Dynamic form based on active step */}
              <PredictionForm 
                onResult={handlePredictionResult}
                onUpdateForm={handleFormUpdate}
                activeStep={activeStep}
                formData={formData}
              />
            </div>
          </div>

          {/* Health Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center"
              whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heartbeat text-green-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Kesehatan Jantung</h3>
              <p className="text-gray-600 text-sm">
                Deteksi dini meningkatkan peluang penanganan risiko kardiovaskular secara efektif.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center"
              whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">AI Prediktif</h3>
              <p className="text-gray-600 text-sm">
                Analisis AI canggih menggunakan model machine learning dengan akurasi hingga 85%.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center"
              whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-shield text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Privasi Data</h3>
              <p className="text-gray-600 text-sm">
                Data Anda tetap aman dan terenkripsi dengan standar keamanan tertinggi.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-xl p-8 text-center max-w-sm mx-4 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.i 
                    className="fas fa-heartbeat text-red-600 text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Menganalisis Data...</h3>
                <p className="text-gray-600 mb-6">
                  Mohon tunggu, sistem AI sedang memproses data kesehatan Anda untuk menghasilkan prediksi yang akurat
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-red-600 h-2 rounded-full" 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PredictionPage;