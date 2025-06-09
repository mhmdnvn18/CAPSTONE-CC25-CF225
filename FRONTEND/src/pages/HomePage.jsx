import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Animated count component
const AnimatedCounter = ({ target, duration = 2000, className = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(percentage * target));
      
      if (progress < duration) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);
  
  return <span className={className}>{count}%</span>;
};

// FAQ item component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      className="border-b border-gray-200 py-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <button 
        className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-red-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-red-600"
        >
          <i className="fas fa-chevron-down"></i>
        </motion.span>
      </button>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? '1rem' : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden text-gray-600"
      >
        <p>{answer}</p>
      </motion.div>
    </motion.div>
  );
};

// Interactive card component
const FeatureCard = ({ icon, title, description, index }) => {
  return (
    <motion.div 
      className="text-center p-6 rounded-xl border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-red-500 via-red-600 to-red-700 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-10"></div>
      
      <motion.div 
        className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-${icon.color}-100 to-${icon.color}-200`}
        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <i className={`fas ${icon.name} text-${icon.color}-600 text-2xl`}></i>
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">{title}</h3>
      <p className="text-gray-600 relative z-10">
        {description}
      </p>
    </motion.div>
  );
};

function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // PWA Install detection
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // PWA Install handler
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  // Service worker message handler
  useEffect(() => {
    const handleServiceWorkerMessage = (event) => {
      if (event.data && event.data.type === 'FORCE_SCROLL_TOP') {
        window.scrollTo(0, 0);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, []);

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Pasien",
      image: "/images/testimonial-1.jpg", // Use local fallback images
      text: "IllDetect membantu saya mengetahui risiko kardiovaskular yang selama ini tidak saya sadari. Berkat deteksi dini, saya bisa berkonsultasi dengan dokter tepat waktu."
    },
    {
      name: "Siti Rahma",
      role: "Dokter Umum",
      image: "/images/testimonial-2.jpg",
      text: "Sebagai dokter, saya merekomendasikan IllDetect untuk pasien saya. Tool ini membantu mereka memahami faktor risiko dan meningkatkan kesadaran tentang kesehatan kardiovaskular."
    },
    {
      name: "Agus Widodo",
      role: "Pengguna Rutin",
      image: "/images/testimonial-3.jpg",
      text: "Saya menggunakan IllDetect secara berkala untuk memantau kondisi jantung saya. Interface-nya mudah digunakan dan hasil prediksinya akurat."
    }
  ];
  
  const stats = [
    { value: 85, label: "Akurasi Prediksi", icon: "fa-chart-line" },
    { value: 95, label: "Kepuasan Pengguna", icon: "fa-heart" },
    { value: 99, label: "Ketersediaan Sistem", icon: "fa-server" },
  ];
  
  const features = [
    { 
      icon: { name: "fa-bolt", color: "blue" }, 
      title: "Prediksi Cepat", 
      description: "Hasil prediksi dalam hitungan detik dengan akurasi tinggi menggunakan algoritma AI terdepan" 
    },
    { 
      icon: { name: "fa-user-md", color: "green" }, 
      title: "Akurat & Terpercaya", 
      description: "Dikembangkan berdasarkan data medis terpercaya dengan tingkat akurasi prediksi hingga 85%" 
    },
    { 
      icon: { name: "fa-mobile-alt", color: "purple" }, 
      title: "Mudah Digunakan", 
      description: "Interface yang intuitif dan dapat diakses dari perangkat apa pun, kapan pun Anda butuhkan" 
    },
    { 
      icon: { name: "fa-shield-alt", color: "red" }, 
      title: "Keamanan Data", 
      description: "Data Anda dilindungi dengan enkripsi end-to-end dan tidak pernah dibagikan ke pihak ketiga" 
    },
    { 
      icon: { name: "fa-chart-pie", color: "indigo" }, 
      title: "Visualisasi Hasil", 
      description: "Hasil prediksi disajikan dalam format visual yang mudah dipahami beserta rekomendasi" 
    },
    { 
      icon: { name: "fa-wifi", color: "yellow" }, 
      title: "Mode Offline", 
      description: "Tetap bisa melakukan prediksi meskipun Anda sedang tidak terhubung dengan internet" 
    }
  ];
  
  const faqs = [
    {
      question: "Bagaimana cara kerja prediksi IllDetect?",
      answer: "IllDetect menggunakan algoritma machine learning yang dilatih dengan data kardiovaskular yang luas. Sistem menganalisis faktor risiko Anda seperti tekanan darah, kolesterol, dan gaya hidup untuk menghasilkan prediksi risiko kardiovaskular yang akurat."
    },
    {
      question: "Apakah data saya aman?",
      answer: "Ya, keamanan data adalah prioritas utama kami. Semua data yang Anda masukkan dienkripsi dan tidak pernah dibagikan kepada pihak ketiga. Data hanya digunakan untuk menghasilkan prediksi dan tidak disimpan secara permanen."
    },
    {
      question: "Seberapa akurat prediksi yang dihasilkan?",
      answer: "Model prediksi kami memiliki tingkat akurasi sekitar 85%, berdasarkan validasi dengan dataset medis yang komprehensif. Namun, hasil prediksi tidak menggantikan diagnosis medis profesional."
    },
    {
      question: "Apakah saya perlu membuat akun untuk menggunakan IllDetect?",
      answer: "Tidak, Anda bisa langsung menggunakan IllDetect tanpa perlu membuat akun atau login. Cukup masukkan data kesehatan Anda dan dapatkan hasil prediksi instan."
    },
    {
      question: "Bagaimana jika saya tidak memiliki semua data yang diminta?",
      answer: "Untuk hasil yang paling akurat, sebaiknya lengkapi semua data yang diminta. Namun, IllDetect masih bisa memberikan estimasi risiko berdasarkan data yang tersedia, meskipun akurasinya mungkin berkurang."
    }
  ];
  
  // Scroll animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Offline Status Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-amber-600 text-white py-2 px-4 text-center text-sm fixed top-0 left-0 right-0 z-50"
          >
            <i className="fas fa-wifi-slash mr-2"></i>
            Anda sedang offline. Aplikasi tetap berjalan dengan fitur terbatas.
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Install Banner */}
      <AnimatePresence>
        {isInstallable && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-blue-600 text-white py-3 px-4 text-center fixed top-0 left-0 right-0 z-40"
            style={{ top: !isOnline ? '32px' : '0' }}
          >
            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm">
                <i className="fas fa-download mr-2"></i>
                Install IllDetect untuk akses lebih cepat dan offline
              </span>
              <button
                onClick={handleInstallClick}
                className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Install
              </button>
              <button
                onClick={() => setIsInstallable(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Parallax Effect */}
      <section 
        className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-red-50 via-white to-blue-50 py-20"
        style={{ paddingTop: (!isOnline || isInstallable) ? '80px' : '20px' }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-red-200 blur-3xl opacity-30"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, 30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-200 blur-3xl opacity-30"
            animate={{ 
              x: [0, -30, 0], 
              y: [0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <motion.i 
                  className="fas fa-heartbeat text-white text-4xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                ></motion.i>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Deteksi Dini <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Penyakit Kardiovaskular</span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Prediksi risiko penyakit kardiovaskular Anda secara cepat dan mudah menggunakan teknologi AI terbaru. 
              Data Anda aman dan hanya digunakan untuk analisis prediksi yang akurat.
            </motion.p>
            
            {/* Animated CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Link
                to="/prediction"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center">
                  <motion.i 
                    className="fas fa-heartbeat mr-3 text-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  ></motion.i>
                  MULAI PREDIKSI SEKARANG
                  {!isOnline && (
                    <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                      Offline
                    </span>
                  )}
                  <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform duration-300"></i>
                </span>
              </Link>
            </motion.div>

            {/* Enhanced Trust Indicators with offline status */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center justify-center space-x-2 text-gray-600 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <i className="fas fa-shield-alt text-green-600"></i>
                <span className="font-medium">Data Aman</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center space-x-2 text-gray-600 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <i className="fas fa-brain text-blue-600"></i>
                <span className="font-medium">AI Technology</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center space-x-2 text-gray-600 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all"
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <i className={`fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'} ${isOnline ? 'text-green-600' : 'text-orange-600'}`}></i>
                <span className="font-medium">{isOnline ? 'Online' : 'Offline Mode'}</span>
              </motion.div>
            </motion.div>
            
            {/* Scroll Down Indicator */}
            <motion.div 
              className="absolute bottom-10 left-0 right-0 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <motion.div 
                className="text-gray-500 cursor-pointer"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={() => window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                })}
              >
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="inline-flex items-center justify-center mb-4">
                  <i className={`fas ${stat.icon} text-red-600 text-xl mr-3`}></i>
                  <span className="text-4xl font-bold text-gray-800">
                    <AnimatedCounter target={stat.value} />
                  </span>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with Interactive Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Mengapa Memilih IllDetect?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform terdepan untuk deteksi dini risiko kardiovaskular dengan teknologi machine learning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Version */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cara Kerja IllDetect
            </h2>
            <p className="text-gray-600">
              Proses sederhana dalam 3 langkah untuk mendapatkan prediksi risiko kardiovaskular
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between relative">
            {/* Progress Line (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0">
              <motion.div 
                className="h-full bg-red-600" 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              ></motion.div>
            </div>

            {[
              {
                step: 1,
                title: "Input Data",
                description: "Masukkan data kesehatan seperti usia, tekanan darah, kolesterol, dan gaya hidup",
                icon: "fa-edit",
                color: "red"
              },
              {
                step: 2,
                title: "Analisis AI",
                description: "Sistem AI menganalisis data Anda menggunakan algoritma machine learning yang canggih",
                icon: "fa-cog",
                color: "blue"
              },
              {
                step: 3,
                title: "Hasil Prediksi",
                description: "Dapatkan hasil prediksi risiko lengkap dengan rekomendasi kesehatan yang personal",
                icon: "fa-chart-line",
                color: "green"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="flex-1 text-center mb-8 md:mb-0 relative z-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.5 }}
              >
                <motion.div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative shadow-md"
                  style={{ backgroundColor: item.color === 'red' ? '#fee2e2' : item.color === 'blue' ? '#dbeafe' : '#dcfce7' }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <motion.div 
                    className="w-full h-full bg-white rounded-full flex items-center justify-center border-4"
                    style={{ borderColor: item.color === 'red' ? '#ef4444' : item.color === 'blue' ? '#3b82f6' : '#22c55e' }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                  >
                    <span className="text-2xl font-bold text-gray-800">{item.step}</span>
                  </motion.div>
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: item.color === 'red' ? '#dc2626' : item.color === 'blue' ? '#2563eb' : '#16a34a' }}
                  >
                    <i className={`fas ${item.icon} text-white text-sm`}></i>
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 max-w-xs mx-auto">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Apa Kata Pengguna
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pengalaman nyata dari pengguna yang telah merasakan manfaat IllDetect
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg p-8">
              {/* Decorative quotes */}
              <div className="absolute top-0 left-0 text-6xl text-red-100 -translate-x-1/4 -translate-y-1/4">
                <i className="fas fa-quote-left"></i>
              </div>
              <div className="absolute bottom-0 right-0 text-6xl text-red-100 translate-x-1/4 translate-y-1/4">
                <i className="fas fa-quote-right"></i>
              </div>
              
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-red-100 bg-gray-200 flex items-center justify-center">
                      <img 
                        src={testimonials[activeTestimonial].image} 
                        alt={testimonials[activeTestimonial].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center text-gray-400">
                        <i className="fas fa-user text-2xl"></i>
                      </div>
                    </div>
                    <p className="text-gray-600 italic text-lg mb-6">"{testimonials[activeTestimonial].text}"</p>
                    <h4 className="font-bold text-gray-800">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-red-600 text-sm">{testimonials[activeTestimonial].role}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex justify-center mt-8">
              <button 
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-colors mr-4"
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 ${activeTestimonial === index ? 'bg-red-600' : 'bg-gray-300'}`}
                  onClick={() => setActiveTestimonial(index)}
                ></button>
              ))}
              
              <button 
                className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-red-600 hover:text-white transition-colors ml-4"
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum tentang IllDetect
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 
            className="text-4xl font-bold text-white mb-6"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Mulai Deteksi Dini Sekarang
          </motion.h2>
          
          <motion.p 
            className="text-red-100 max-w-2xl mx-auto mb-10 text-lg"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Bersama, kita membangun masa depan skrining kesehatan kardiovaskular. 
            {!isOnline && " Dapat digunakan offline kapan saja!"}
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/prediction"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-full hover:bg-gray-100 transition transform hover:scale-105 shadow-lg group"
            >
              <motion.i 
                className="fas fa-heartbeat mr-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              ></motion.i>
              <span>Mulai Prediksi Gratis</span>
              {!isOnline && (
                <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                  Offline Ready
                </span>
              )}
              <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
            </Link>
          </motion.div>
          
          <motion.p 
            className="text-red-200 mt-6 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <i className="fas fa-lock mr-2"></i>
            Tidak perlu registrasi. Gratis. Hasil instan.
            {!isOnline && (
              <>
                <br />
                <i className="fas fa-wifi-slash mr-2"></i>
                Tersedia offline - tidak memerlukan koneksi internet
              </>
            )}
          </motion.p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;