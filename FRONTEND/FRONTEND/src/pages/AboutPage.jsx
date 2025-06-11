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
    <div className="px-4 sm:px-6 py-10 bg-gradient-to-br from-blue-50 via-white to-red-50 min-h-screen text-gray-800">
      {/* Enhanced Header */}
      <AnimatedSection>
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-block p-3 bg-red-50 rounded-full mb-4"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-md"
              >
                <i className="fas fa-heartbeat text-2xl"></i>
              </motion.div>
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Bertemu dengan Tim Kami</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tim terbaik kami yang mendedikasikan mengembangkan IllDetect untuk deteksi
              dini risiko penyakit kardiovaskular
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Team Navigation Tabs */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-center">
          <div className="bg-white rounded-full shadow-md p-1.5 inline-flex">
            <motion.button
              className={`px-6 py-3 rounded-full font-medium text-sm transition ${
                activeTab === 'ml' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('ml')}
              whileHover={{ scale: activeTab !== 'ml' ? 1.05 : 1 }}
              whileTap={{ scale: 0.97 }}
            >
              <i className="fas fa-brain mr-2"></i>
              Tim Machine Learning
            </motion.button>
            <motion.button
              className={`px-6 py-3 rounded-full font-medium text-sm transition ${
                activeTab === 'fullstack' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('fullstack')}
              whileHover={{ scale: activeTab !== 'fullstack' ? 1.05 : 1 }}
              whileTap={{ scale: 0.97 }}
            >
              <i className="fas fa-code mr-2"></i>
              Tim Full-Stack
            </motion.button>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <AnimatedSection>
        <div className="max-w-6xl mx-auto mb-20">
          <div className="relative">
            {/* Team Members grid with pagination indicator */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {teamMembers[activeTab].map((member, index) => (
                  <motion.div
                    key={member.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setSelectedMember(member)}
                    className="cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full relative group">
                      {/* Circular Mask with Gradient Border for Photo */}
                      <div className="h-56 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10">
                          <img 
                            src={member.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} 
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                            }}
                          />
                        </div>
                        
                        {/* Glowing effect on hover */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 opacity-0 group-hover:opacity-20 transition-all duration-500"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.2 }}
                        />
                      </div>

                      {/* Member Info */}
                      <div className="p-6 text-center">
                        <h3 className="font-bold text-xl text-gray-900">{member.name}</h3>
                        <p className="text-red-600 mb-3">{member.role}</p>
                        
                        <div className="mb-4 px-6 py-1 bg-gray-50 rounded-lg mx-auto inline-block">
                          <p className="text-sm text-gray-500">{member.university}</p>
                        </div>
                        
                        <div className="flex justify-center space-x-3 mt-4">
                          {Object.entries(member.social).map(([platform, url]) => (
                            <motion.a
                              key={platform}
                              href={url}
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white transition-all duration-300"
                              whileHover={{ y: -3, scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className={`fab fa-${platform === 'portfolio' ? 'globe' : platform} text-lg`}></i>
                            </motion.a>
                          ))}
                        </div>
                        
                        <div className="mt-5">
                          <motion.button 
                            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center justify-center mx-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <i className="fas fa-circle-info mr-1"></i> Lihat Profil
                          </motion.button>
                        </div>
                      </div>

                      {/* Corner decoration */}
                      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                        <div className="bg-red-600 rotate-45 transform origin-bottom-left w-24 h-24 -translate-y-12 translate-x-4"></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Page indicator dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {/* In case we need pagination in the future */}
            </div>
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
                IllDetect adalah aplikasi berbasis web yang memungkinkan pengguna untuk mendeteksi risiko penyakit kardiovaskular secara dini. Aplikasi ini menggunakan algoritma machine learning yang dikembangkan dan dilatih dengan dataset yang komprehensif.
              </p>
              <p className="text-gray-600 mb-4">
                Proyek ini dikembangkan sebagai bagian dari Capstone Project untuk program DBS Foundation Coding Camp 2025 oleh tim kami yang terdiri dari mahasiswa berbagai universitas di Indonesia.
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
                  <span>Prediksi risiko penyakit kardiovaskular berdasarkan faktor risiko</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-brain mt-1 mr-3 text-red-200"></i>
                  <span>Analisis data kesehatan menggunakan model AI terlatih</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-bolt mt-1 mr-3 text-red-200"></i>
                  <span>Hasil prediksi yang cepat dan akurat</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-stethoscope mt-1 mr-3 text-red-200"></i>
                  <span>Rekomendasi kesehatan berdasarkan hasil analisis</span>
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