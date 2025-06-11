import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.name.trim()) newErrors.name = 'Nama harus diisi';
    
    if (!formState.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formState.subject.trim()) newErrors.subject = 'Subjek harus diisi';
    if (!formState.message.trim()) newErrors.message = 'Pesan harus diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        
        // Reset form after successful submission
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }, 1500);
    }
  };

  // Animation variants
  const formFieldVariants = {
    focus: { scale: 1.02, borderColor: '#ef4444' },
    blur: { scale: 1, borderColor: '#e5e7eb' },
    error: { x: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }
  };

  const contactItems = [
    {
      icon: 'fa-map-marker-alt',
      title: 'Alamat',
      content: 'Jl. Urip Sumoharjo No. 43, Yogyakarta, Indonesia',
      color: 'blue'
    },
    {
      icon: 'fa-envelope',
      title: 'Email',
      content: 'illdetect.team@gmail.com',
      color: 'red'
    },
    {
      icon: 'fa-phone-alt',
      title: 'Telepon',
      content: '+62 8123 4567 890',
      color: 'green'
    }
  ];

  const socialMedia = [
    { icon: 'fa-github', url: 'https://github.com/diazrahman21', color: 'gray-800' },
    { icon: 'fa-linkedin-in', url: 'https://www.linkedin.com/in/muh-diaz-nazarudin-rahman-0aa85a2a0/', color: 'blue-600' },
    { icon: 'fa-instagram', url: 'https://www.instagram.com/diazrhman/', color: 'pink-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 py-16 px-4 sm:px-6">
      {/* Page Header */}
      <AnimatedSection>
        <div className="max-w-7xl mx-auto mb-16 text-center">
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
              <i className="fas fa-paper-plane text-2xl"></i>
            </motion.div>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami dengan pertanyaan, saran, atau masukan Anda.
          </p>
        </div>
      </AnimatedSection>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <i className="fas fa-envelope-open-text mr-3"></i>
                  Kirim Pesan
                </h2>
              </div>
              
              <div className="p-6 sm:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <i className="fas fa-check-circle text-green-600 mr-2"></i>
                      </div>
                      <div>
                        <p className="font-medium">Pesan berhasil dikirim!</p>
                        <p className="text-sm">Terima kasih atas pesan Anda. Tim kami akan segera menghubungi Anda.</p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap <span className="text-red-600">*</span>
                      </label>
                      <motion.div
                        variants={formFieldVariants}
                        animate={errors.name ? 'error' : undefined}
                      >
                        <motion.input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                          placeholder="Masukkan nama lengkap Anda"
                          whileFocus="focus"
                          whileBlur="blur"
                        />
                      </motion.div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          {errors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <motion.div
                        variants={formFieldVariants}
                        animate={errors.email ? 'error' : undefined}
                      >
                        <motion.input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                          placeholder="Masukkan alamat email Anda"
                          whileFocus="focus"
                          whileBlur="blur"
                        />
                      </motion.div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subjek <span className="text-red-600">*</span>
                      </label>
                      <motion.div
                        variants={formFieldVariants}
                        animate={errors.subject ? 'error' : undefined}
                      >
                        <motion.input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                          placeholder="Masukkan subjek pesan"
                          whileFocus="focus"
                          whileBlur="blur"
                        />
                      </motion.div>
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          {errors.subject}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Pesan <span className="text-red-600">*</span>
                      </label>
                      <motion.div
                        variants={formFieldVariants}
                        animate={errors.message ? 'error' : undefined}
                      >
                        <motion.textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          rows="5"
                          className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                          placeholder="Tuliskan pesan Anda di sini"
                          whileFocus="focus"
                          whileBlur="blur"
                        />
                      </motion.div>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          {errors.message}
                        </p>
                      )}
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Kirim Pesan
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Info Section */}
          <div className="flex flex-col space-y-8">
            {/* Map Section */}
            <AnimatedSection delay={0.3}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-80">
                <div className="h-full w-full relative">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    {/* Simplified map implementation with better fallback */}
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center relative">
                      {/* Map content with reliable fallback */}
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center p-6">
                          <div className="text-red-600 mb-3">
                            <i className="fas fa-map-marker-alt text-4xl"></i>
                          </div>
                          <h3 className="font-bold text-gray-800 text-lg mb-1">Wisma Hartono</h3>
                          <p className="text-gray-600">Jl. Urip Sumoharjo No. 43, Yogyakarta, Indonesia</p>
                          <a 
                            href="https://maps.google.com/?q=Wisma+Hartono,Yogyakarta,Indonesia" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center text-sm text-red-600 hover:text-red-700"
                          >
                            <i className="fas fa-external-link mr-1"></i> Buka di Google Maps
                          </a>
                        </div>
                      </div>
                      {/* Optional map overlay for better UX */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-white p-2 rounded-lg shadow-md">
                          <motion.a 
                            href="https://maps.google.com/?q=Wisma+Hartono,Yogyakarta,Indonesia" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-gray-600 flex items-center"
                            whileHover={{ scale: 1.05 }}
                          >
                            <i className="fas fa-directions text-red-600 mr-1"></i> Petunjuk Arah
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <i className="fas fa-map-marked-alt mr-3"></i>
                      Lokasi Kami
                    </h2>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Info Cards */}
            <AnimatedSection delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl shadow-md p-4 flex items-start space-x-4"
                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: item.color === 'blue' ? '#dbeafe' : 
                                        item.color === 'red' ? '#fee2e2' : 
                                        item.color === 'green' ? '#dcfce7' : '#f3f4f6'
                      }}
                    >
                      <i 
                        className={`fas ${item.icon}`}
                        style={{ 
                          color: item.color === 'blue' ? '#2563eb' : 
                                item.color === 'red' ? '#dc2626' : 
                                item.color === 'green' ? '#16a34a' : '#4b5563'
                        }}
                      ></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.content}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            {/* Social Media Section */}
            <AnimatedSection delay={0.5}>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <i className="fas fa-share-alt mr-3"></i>
                    Media Sosial
                  </h2>
                </div>
                <div className="p-6 flex justify-center space-x-6">
                  {socialMedia.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-md"
                      style={{ 
                        backgroundColor: social.color === 'gray-800' ? '#1f2937' : 
                                        social.color === 'blue-600' ? '#2563eb' : 
                                        social.color === 'blue-400' ? '#60a5fa' : 
                                        social.color === 'pink-600' ? '#db2777' : '#4b5563'
                      }}
                      whileHover={{ 
                        scale: 1.2, 
                        rotate: 5,
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: 0.1 * index,
                          duration: 0.5
                        }
                      }}
                    >
                      <i className={`fab ${social.icon}`}></i>
                    </motion.a>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* FAQ Link */}
            <AnimatedSection delay={0.6}>
              <motion.div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-question-circle text-white text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-2">Punya Pertanyaan?</h3>
                    <p className="mb-4 text-purple-100">Temukan jawaban untuk pertanyaan umum tentang IllDetect pada halaman utama kami.</p>
                    <motion.a 
                      href="/#faq" 
                      className="inline-flex items-center px-4 py-2 bg-white text-purple-700 rounded-lg font-medium text-sm hover:bg-purple-50 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      Lihat Pertanyaan yang Sering Diajukan
                      <i className="fas fa-arrow-right ml-2"></i>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;