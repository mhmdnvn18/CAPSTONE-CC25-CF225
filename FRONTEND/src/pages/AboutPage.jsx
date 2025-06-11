import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

// Reorganized team data with division information
const teamMembers = {
  ml: [
    {
      name: 'Marsha Rasyida Al-Farabi',
      role: 'ML Lead & Data Scientist',
      university: 'Universitas Gadjah Mada',
      id: 'MC008D5X2348',
      skills: 'Analisis Data, Feature Engineering, Pengembangan Model',
      photo: '/img/team/marsha.jpg',
      social: {
        linkedin: '#',
        github: '#',
        portfolio: '#'
      }
    },
    {
      name: 'Syifa Azzahra Susilo',
      role: 'ML Engineer',
      university: 'Universitas Gadjah Mada',
      id: 'MC008D5X2087',
      skills: 'Pelatihan Model, Optimasi Hyperparameter',
      photo: '/img/team/syifa.jpg',
      social: {
        linkedin: '#',
        github: '#',
        portfolio: '#'
      }
    },
    {
      name: 'Indara Nurwulandari',
      role: 'Data Engineer',
      university: 'Universitas Gadjah Mada',
      id: 'MC008D5X2388',
      skills: 'Pra-pemrosesan Data, Evaluasi Model',
      photo: '/img/team/indara.jpg',
      social: {
        linkedin: '#',
        github: '#',
        portfolio: '#'
      }
    }
  ],
  fullstack: [
    {
      name: 'Muhammad Novian',
      role: 'Full-Stack Lead',
      university: 'Universitas Muhammadiyah Yogyakarta',
      id: 'FC492D5Y2169',
      skills: 'Desain Frontend, Integrasi Backend',
      photo: '/img/team/novian.jpg',
      social: {
        linkedin: '#',
        github: '#',
        portfolio: '#'
      }
    },
    {
      name: 'Muh Diaz Nazarudin Rahman',
      role: 'Backend Developer',
      university: 'Universitas Ahmad Dahlan',
      id: 'FC179D5Y0593',
      skills: 'Pengembangan API, Manajemen Basis Data',
      photo: '/img/team/diaz.jpg',
      social: {
        linkedin: '#',
        github: '#',
        portfolio: '#'
      }
    },
    {
      name: 'Aditya Navra Erlangga',
      role: 'Frontend Developer',
      university: 'Universitas Ahmad Dahlan',
      id: 'FC179D5Y1055',
      skills: 'Desain UI/UX, Pengembangan Web Responsif',
      photo: '/img/team/aditya.jpg',
      social: {
        linkedin: '#',
        github: '#',
        portfolio: '#'
      }
    }
  ]
};

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('ml');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -15,
      scale: 1.02,
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <div className="px-4 sm:px-6 py-10 bg-gradient-to-br from-red-50 via-white to-blue-50 min-h-screen text-gray-800 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-300 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-red-200/20 to-pink-200/20 blur-3xl"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200/20 to-cyan-200/20 blur-3xl"
          animate={{ 
            x: [0, -80, 0], 
            y: [0, -60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      {/* Enhanced Header */}
      <AnimatedSection>
        <div className="max-w-7xl mx-auto mb-16 relative z-10">
          <div className="text-center">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
              className="inline-block p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-full mb-6 shadow-lg"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full w-20 h-20 flex items-center justify-center shadow-xl relative"
              >
                <i className="fas fa-heartbeat text-3xl"></i>
                
                {/* Pulsing rings */}
                {[0, 1].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-4 border-red-300 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1], 
                      opacity: [0.8, 0, 0.8] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 1 
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Bertemu dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">Tim Kami</span>
            </motion.h1>
            
            <motion.p 
              className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Tim terbaik kami yang mendedikasikan mengembangkan IllDetect untuk estimasi risiko
              penyakit kardiovaskular sebagai alat bantu skrining awal
            </motion.p>
          </div>
        </div>
      </AnimatedSection>

      {/* Enhanced Team Navigation Tabs */}
      <div className="max-w-6xl mx-auto mb-16 relative z-10">
        <div className="flex justify-center">
          <motion.div 
            className="bg-white rounded-full shadow-xl p-2 inline-flex border border-gray-100"
            whileHover={{ scale: 1.02 }}
          >
            <motion.button
              className={`px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 relative overflow-hidden ${
                activeTab === 'ml' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('ml')}
              whileHover={{ scale: activeTab !== 'ml' ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === 'ml' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="relative flex items-center">
                <motion.i 
                  className="fas fa-brain mr-3"
                  animate={activeTab === 'ml' ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 2, repeat: activeTab === 'ml' ? Infinity : 0 }}
                />
                Tim Machine Learning
              </span>
            </motion.button>
            
            <motion.button
              className={`px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 relative overflow-hidden ${
                activeTab === 'fullstack' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('fullstack')}
              whileHover={{ scale: activeTab !== 'fullstack' ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeTab === 'fullstack' && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <span className="relative flex items-center">
                <motion.i 
                  className="fas fa-code mr-3"
                  animate={activeTab === 'fullstack' ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1.5, repeat: activeTab === 'fullstack' ? Infinity : 0 }}
                />
                Tim Full-Stack
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Team Members Grid */}
      <AnimatedSection>
        <div className="max-w-6xl mx-auto mb-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <AnimatePresence>
              {teamMembers[activeTab].map((member, index) => (
                <motion.div
                  key={member.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setSelectedMember(member)}
                  className="cursor-pointer group"
                >
                  <motion.div 
                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden h-full relative border border-gray-100"
                    whileHover={{ 
                      y: -20,
                      boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)"
                    }}
                  >
                    {/* Enhanced Photo Section */}
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                      {/* Background animation */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        animate={{ 
                          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                      />
                      
                      {/* Enhanced photo container */}
                      <motion.div 
                        className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <img 
                          src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=200`} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&size=200`;
                          }}
                        />
                        
                        {/* Hover overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                        />
                      </motion.div>
                      
                      {/* Floating elements */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-red-400 rounded-full opacity-60"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 20}%`
                          }}
                          animate={{
                            y: [0, -20, 0],
                            scale: [0.8, 1.2, 0.8],
                            opacity: [0.6, 1, 0.6]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5
                          }}
                        />
                      ))}
                    </div>

                    {/* Enhanced Member Info */}
                    <div className="p-8 text-center relative">
                      <motion.h3 
                        className="font-bold text-2xl text-gray-900 mb-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        {member.name}
                      </motion.h3>
                      
                      <motion.p 
                        className="text-red-600 font-semibold mb-4"
                        animate={{ color: ['#dc2626', '#ef4444', '#dc2626'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {member.role}
                      </motion.p>
                      
                      <motion.div 
                        className="mb-6 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mx-auto inline-block"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="text-sm text-gray-600 font-medium">{member.university}</p>
                      </motion.div>
                      
                      {/* Enhanced Social Links */}
                      <div className="flex justify-center space-x-4 mb-6">
                        {Object.entries(member.social).map(([platform, url]) => (
                          <motion.a
                            key={platform}
                            href={url}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white transition-all duration-300 relative overflow-hidden"
                            whileHover={{ 
                              y: -5, 
                              scale: 1.2,
                              boxShadow: "0 10px 20px -5px rgba(239, 68, 68, 0.3)"
                            }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 scale-0 rounded-full"
                              whileHover={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                            <i className={`fab fa-${platform === 'portfolio' ? 'globe' : platform} text-lg relative z-10`}></i>
                          </motion.a>
                        ))}
                      </div>
                      
                      <motion.button 
                        className="text-base font-semibold text-red-600 hover:text-red-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.i 
                          className="fas fa-circle-info mr-2"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                        Lihat Profil Lengkap
                      </motion.button>
                    </div>

                    {/* Enhanced Corner Decoration */}
                    <motion.div 
                      className="absolute top-0 right-0 w-20 h-20 overflow-hidden"
                      whileHover={{ scale: 1.2, rotate: 45 }}
                    >
                      <motion.div 
                        className="bg-gradient-to-bl from-red-600 to-red-700 rotate-45 transform origin-bottom-left w-28 h-28 -translate-y-14 translate-x-4"
                        animate={{ 
                          background: [
                            'linear-gradient(to bottom left, #dc2626, #b91c1c)',
                            'linear-gradient(to bottom left, #ef4444, #dc2626)',
                            'linear-gradient(to bottom left, #dc2626, #b91c1c)'
                          ]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </motion.div>

                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-600/5 to-red-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      animate={{ 
                        background: [
                          'linear-gradient(45deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))',
                          'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))',
                          'linear-gradient(45deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.05))'
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </AnimatedSection>

      {/* Project Info */}
      <AnimatedSection delay={0.2}>
        <div className="max-w-6xl mx-auto mb-16 bg-white rounded-2xl shadow-lg overflow-hidden hover-lift">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang IllDetect</h2>
              <p className="text-gray-600 mb-4">
                IllDetect adalah aplikasi berbasis web yang memungkinkan pengguna untuk melakukan estimasi risiko penyakit kardiovaskular secara dini sebagai alat bantu skrining. Aplikasi ini menggunakan algoritma machine learning yang dikembangkan dan dilatih dengan dataset yang komprehensif.
              </p>
              <p className="text-gray-600 mb-4">
                Proyek ini dikembangkan sebagai bagian dari Capstone Project untuk program DBS Foundation Coding Camp 2025 oleh tim kami yang terdiri dari mahasiswa berbagai universitas di Indonesia sebagai prototype dan alat edukasi.
              </p>
              <div className="flex space-x-4 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <i className="fas fa-code-branch mr-1"></i> CC25-CF225
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <i className="fas fa-award mr-1"></i> Capstone Project
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 text-white flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4">Fitur Utama</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-heart-circle-check mt-1 mr-3 text-red-200"></i>
                  <span>Estimasi risiko penyakit kardiovaskular berdasarkan faktor risiko</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-brain mt-1 mr-3 text-red-200"></i>
                  <span>Analisis data kesehatan menggunakan model AI untuk skrining awal</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-bolt mt-1 mr-3 text-red-200"></i>
                  <span>Hasil estimasi yang cepat sebagai alat bantu</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-stethoscope mt-1 mr-3 text-red-200"></i>
                  <span>Rekomendasi kesehatan umum berdasarkan hasil analisis</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-wifi-slash mt-1 mr-3 text-red-200"></i>
                  <span>Kemampuan mode offline untuk penggunaan tanpa koneksi internet</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Technologies Used */}
      <AnimatedSection delay={0.4}>
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">Teknologi yang Digunakan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover-lift">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <i className="fab fa-react text-blue-600 text-2xl"></i>
              </motion.div>
              <h3 className="font-semibold">React</h3>
              <p className="text-sm text-gray-500">Frontend Library</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover-lift">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <i className="fab fa-python text-blue-600 text-2xl"></i>
              </motion.div>
              <h3 className="font-semibold">Python</h3>
              <p className="text-sm text-gray-500">Machine Learning</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover-lift">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <i className="fab fa-node-js text-green-600 text-2xl"></i>
              </motion.div>
              <h3 className="font-semibold">Node.js</h3>
              <p className="text-sm text-gray-500">Backend</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover-lift">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <i className="fas fa-database text-indigo-600 text-2xl"></i>
              </motion.div>
              <h3 className="font-semibold">Supabase</h3>
              <p className="text-sm text-gray-500">Database</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection delay={0.5}>
        <div className="max-w-4xl mx-auto mt-20 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
            <p className="text-gray-600 mb-6">
              Tertarik untuk berkolaborasi atau memiliki pertanyaan? Jangan ragu untuk menghubungi tim kami.
            </p>
            <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
              <motion.a 
                href="mailto:illdetect.team@gmail.com" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-envelope-open-text mr-2"></i>
                Email Kami
              </motion.a>
              <motion.a 
                href="https://github.com/illdetect" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:shadow-lg transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fab fa-github mr-2"></i>
                GitHub Repository
              </motion.a>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              className="bg-white rounded-2xl overflow-hidden max-w-lg w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Photo */}
              <div className="bg-gradient-to-r from-blue-600 to-red-600 h-40 relative">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                    <img 
                      src={selectedMember.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=random`}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=random`;
                      }}
                    />
                  </div>
                </div>
                <button 
                  className="absolute top-4 right-4 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all"
                  onClick={() => setSelectedMember(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Modal Content */}
              <div className="pt-20 pb-6 px-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h3>
                  <p className="text-red-600">{selectedMember.role}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Pendidikan</h4>
                    <p>{selectedMember.university}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">ID Peserta</h4>
                    <p>{selectedMember.id}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Keahlian</h4>
                    <p>{selectedMember.skills}</p>
                  </div>

                  <div className="flex justify-center space-x-4 mt-6">
                    {Object.entries(selectedMember.social).map(([platform, url]) => (
                      <motion.a
                        key={platform}
                        href={url}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                        whileHover={{ y: -3, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <i className={`fab fa-${platform === 'portfolio' ? 'globe' : platform} text-xl`}></i>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AboutPage;