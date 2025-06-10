import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PredictionResult from '../components/PredictionResult';

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fromPrediction, setFromPrediction] = useState(false);

  useEffect(() => {
    // Check if coming from prediction page
    const comingFromPrediction = location.state?.fromPrediction;
    setFromPrediction(comingFromPrediction);

    // Get result from state or sessionStorage
    const stateResult = location.state?.result;
    const storedResult = sessionStorage.getItem('predictionResult');
    
    if (stateResult) {
      setResult(stateResult);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        console.log('📊 Loaded result from storage:', parsedResult);
        setResult(parsedResult);
      } catch (error) {
        console.error('Error parsing stored result:', error);
        navigate('/prediction');
      }
    } else {
      console.log('⚠️ No prediction result found');
      navigate('/prediction');
    }
    
    setLoading(false);
  }, [navigate, location.state]);

  const handleNewPrediction = () => {
    sessionStorage.removeItem('predictionResult');
    navigate('/prediction');
  };

  const handleGoHome = () => {
    sessionStorage.removeItem('predictionResult');
    navigate('/');
  };

  const handleShareResult = () => {
    if (navigator.share && result) {
      const prediction = result.prediction || result;
      const riskLabel = prediction.risk_label || (prediction.risk === 1 ? 'High Risk' : 'Low Risk');
      const confidence = prediction.confidence || Math.round((prediction.probability || 0.5) * 100);
      
      navigator.share({
        title: 'Hasil Prediksi Risiko Kardiovaskular - IllDetect',
        text: `Hasil prediksi risiko kardiovaskular saya: ${riskLabel} (${confidence}%)`,
        url: window.location.origin
      }).catch(console.error);
    } else {
      const prediction = result.prediction || result;
      const riskLabel = prediction.risk_label || (prediction.risk === 1 ? 'High Risk' : 'Low Risk');
      const confidence = prediction.confidence || Math.round((prediction.probability || 0.5) * 100);
      const shareText = `Hasil prediksi risiko kardiovaskular saya: ${riskLabel} (${confidence}%) via IllDetect`;
      
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

  const handleDownloadPDF = () => {
    // Future enhancement: Generate PDF report
    alert('Fitur download PDF akan segera tersedia!');
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-red-50 min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.i 
              className="fas fa-heart-pulse text-red-600 text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            ></motion.i>
          </div>
          <p className="text-gray-600">Memuat hasil...</p>
        </motion.div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-red-50">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-8 relative overflow-hidden">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                  scale: 0
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with Animation */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: fromPrediction ? 0.5 : 0 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-red-600 rounded-full shadow-lg mb-6"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <i className="fas fa-chart-line text-white text-3xl"></i>
            </motion.div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Hasil Prediksi Kardiovaskular
            </h1>
            <p className="text-gray-600 text-lg">
              Berikut adalah hasil analisis risiko berdasarkan data yang Anda berikan
            </p>
          </motion.div>

          {/* Result Component with Stagger Animation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: fromPrediction ? 1 : 0.2 }}
          >
            <PredictionResult result={result} />
          </motion.div>

          {/* Action Buttons with Hover Effects */}
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center mt-8 no-print"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: fromPrediction ? 1.5 : 0.5 }}
          >
            <motion.button
              onClick={handleNewPrediction}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.i 
                className="fas fa-redo mr-2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              ></motion.i>
              <span>Prediksi Ulang</span>
              <motion.div
                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.button>

            <motion.button
              onClick={handlePrint}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-print mr-2"></i>
              Cetak Hasil
            </motion.button>

            <motion.button
              onClick={handleDownloadPDF}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-download mr-2"></i>
              Download PDF
            </motion.button>

            <motion.button
              onClick={handleShareResult}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-share mr-2"></i>
              Bagikan
            </motion.button>

            <motion.button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-home mr-2"></i>
              Kembali ke Beranda
            </motion.button>
          </motion.div>

          {/* Additional Info Card */}
          <motion.div 
            className="mt-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: fromPrediction ? 2 : 0.7 }}
          >
            <div className="flex items-start">
              <i className="fas fa-lightbulb text-blue-500 text-2xl mr-4 mt-1"></i>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Langkah Selanjutnya</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Simpan atau cetak hasil ini untuk referensi dokter
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Konsultasikan hasil dengan tenaga medis profesional
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Lakukan pemeriksaan ulang secara berkala
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    Ikuti rekomendasi gaya hidup yang disarankan
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;