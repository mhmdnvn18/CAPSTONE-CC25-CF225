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
  const [showDetails, setShowDetails] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate floating particles for background
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 15 + 10
      });
    }
    setParticles(newParticles);
  }, []);

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
      <div className="bg-gradient-to-br from-red-50 via-white to-blue-50 min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <motion.i 
              className="fas fa-heartbeat text-red-600 text-2xl"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-blue-50">
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
            <i className="fas fa-heartbeat mr-2"></i>
            Mulai Prediksi
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-red-300 rounded-full opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Large Gradient Orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-red-200/30 to-pink-200/30 blur-3xl"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/30 to-cyan-200/30 blur-3xl"
          animate={{ 
            x: [0, -80, 0], 
            y: [0, -60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      {/* Enhanced Confetti Animation with Red Theme */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(60)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
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
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'][i % 5]
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Header with Red Theme */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: fromPrediction ? 0.5 : 0 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full shadow-2xl mb-6 relative"
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity }
              }}
              whileHover={{ scale: 1.15, rotate: 5 }}
            >
              <motion.i 
                className="fas fa-chart-line text-white text-4xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Pulsing ring effect */}
              <motion.div
                className="absolute inset-0 border-4 border-red-300 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.h1 
              className="text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Hasil Estimasi <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Kardiovaskular</span>
            </motion.h1>
            <motion.p 
              className="text-gray-600 text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Berikut adalah hasil estimasi risiko berdasarkan data yang Anda berikan sebagai alat bantu skrining awal
            </motion.p>
          </motion.div>

          {/* Enhanced Result Component */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: fromPrediction ? 1 : 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-100 to-transparent rounded-bl-full opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-transparent rounded-tr-full opacity-50"></div>
              
              <div className="relative z-10">
                <PredictionResult result={result} />
              </div>
            </div>
          </motion.div>

          {/* Enhanced Details Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: fromPrediction ? 1.2 : 0.4 }}
            className="mb-8"
          >
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full bg-white rounded-xl p-4 border border-gray-200 hover:bg-gray-50 transition-all duration-300 group shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
                  <i className="fas fa-info-circle mr-3 text-red-600"></i>
                  Informasi Detail & Rekomendasi Umum
                </span>
                <motion.i 
                  className={`fas fa-chevron-${showDetails ? 'up' : 'down'} text-gray-600 group-hover:text-red-600 transition-colors`}
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-xl p-6 mt-4 border border-gray-200 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <i className="fas fa-heart text-red-600 mr-2"></i>
                          Rekomendasi Gaya Hidup Sehat Umum
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                          {/*
                            "Lakukan olahraga ringan 30 menit setiap hari",
                            "Konsumsi makanan rendah garam dan lemak jenuh",
                            "Kelola stress dengan teknik relaksasi",
                            "Berhenti merokok dan hindari alkohol berlebihan"
                          */}
                          {["Lakukan olahraga ringan 30 menit setiap hari", "Konsumsi makanan rendah garam dan lemak jenuh", "Kelola stress dengan teknik relaksasi", "Berhenti merokok dan hindari alkohol berlebihan"].map((tip, index) => (
                            <motion.li 
                              key={index}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * (index + 1) }}
                            >
                              <i className="fas fa-check-circle text-green-500 mr-2 mt-1 flex-shrink-0"></i>
                              <span>{tip}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <i className="fas fa-calendar-alt text-blue-600 mr-2"></i>
                          Saran Jadwal Pemeriksaan Umum
                        </h3>
                        <ul className="space-y-2 text-gray-600">
                          {/*
                            "Cek tekanan darah setiap 3 bulan",
                            "Tes kolesterol setiap 6 bulan",
                            "EKG dan echocardiogram tahunan",
                            "Konsultasi rutin dengan dokter jantung"
                          */}
                          {["Cek tekanan darah setiap 3 bulan", "Tes kolesterol setiap 6 bulan", "EKG dan echocardiogram tahunan", "Konsultasi rutin dengan dokter jantung"].map((schedule, index) => (
                            <motion.li 
                              key={index}
                              className="flex items-start"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * (index + 1) }}
                            >
                              <i className="fas fa-clock text-orange-500 mr-2 mt-1 flex-shrink-0"></i>
                              <span>{schedule}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Action Buttons with Red Theme */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 no-print"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: fromPrediction ? 1.5 : 0.5 }}
          >
            {/*
              { 
                onClick: handleNewPrediction, 
                gradient: "from-red-600 to-red-700", 
                icon: "fa-redo", 
                text: "Prediksi Ulang",
                description: "Lakukan prediksi baru"
              },
              { 
                onClick: handlePrint, 
                gradient: "from-blue-600 to-blue-700", 
                icon: "fa-print", 
                text: "Cetak Hasil",
                description: "Print laporan"
              },
              { 
                onClick: handleDownloadPDF, 
                gradient: "from-purple-600 to-purple-700", 
                icon: "fa-download", 
                text: "Download PDF",
                description: "Simpan sebagai PDF"
              },
              { 
                onClick: handleShareResult, 
                gradient: "from-green-600 to-green-700", 
                icon: "fa-share", 
                text: "Bagikan",
                description: "Share hasil"
              },
              { 
                onClick: handleGoHome, 
                gradient: "from-gray-600 to-gray-700", 
                icon: "fa-home", 
                text: "Beranda",
                description: "Kembali ke home"
              }
            */}
            { [
              { 
                onClick: handleNewPrediction, 
                gradient: "from-red-600 to-red-700", 
                icon: "fa-redo", 
                text: "Prediksi Ulang",
                description: "Lakukan prediksi baru"
              },
              { 
                onClick: handlePrint, 
                gradient: "from-blue-600 to-blue-700", 
                icon: "fa-print", 
                text: "Cetak Hasil",
                description: "Print laporan"
              },
              { 
                onClick: handleDownloadPDF, 
                gradient: "from-purple-600 to-purple-700", 
                icon: "fa-download", 
                text: "Download PDF",
                description: "Simpan sebagai PDF"
              },
              { 
                onClick: handleShareResult, 
                gradient: "from-green-600 to-green-700", 
                icon: "fa-share", 
                text: "Bagikan",
                description: "Share hasil"
              },
              { 
                onClick: handleGoHome, 
                gradient: "from-gray-600 to-gray-700", 
                icon: "fa-home", 
                text: "Beranda",
                description: "Kembali ke home"
              }
            ].map((button, index) => (
              <motion.button
                key={index}
                onClick={button.onClick}
                className={`relative group p-4 bg-gradient-to-r ${button.gradient} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: fromPrediction ? 1.7 + index * 0.1 : 0.7 + index * 0.1 }}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                <div className="relative z-10 text-center">
                  <motion.i 
                    className={`fas ${button.icon} text-2xl mb-2 block`}
                    animate={{ 
                      rotate: button.icon === 'fa-redo' ? [0, 360] : 0,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                  />
                  <span className="text-sm font-semibold block">{button.text}</span>
                  <span className="text-xs opacity-80 mt-1 block">{button.description}</span>
                </div>

                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Additional Info Card */}
          <motion.div 
            className="mt-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: fromPrediction ? 2 : 0.7 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-50 rounded-bl-full opacity-50"></div>
            
            <div className="flex items-start relative z-10">
              <motion.i 
                className="fas fa-lightbulb text-red-500 text-2xl mr-4 mt-1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Langkah Selanjutnya yang Disarankan</h3>
                <ul className="text-gray-600 space-y-2">
                  {["Simpan atau cetak hasil ini untuk referensi dokter", "Konsultasikan hasil dengan tenaga medis profesional untuk evaluasi lebih lanjut", "Lakukan pemeriksaan medis komprehensif secara berkala", "Ikuti rekomendasi gaya hidup sehat yang disarankan"].map((step, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: fromPrediction ? 2.2 + index * 0.1 : 0.9 + index * 0.1 }}
                    >
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      {step}
                    </motion.li>
                  ))}
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