import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

function Home() {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="min-vh-100 d-flex flex-column">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#E31937' }}>
          <div className="container">
            <div className="d-flex align-items-center">
              <img src="/logo.png" alt="CardioRisk" height="40" />
              <a className="navbar-brand text-white ms-2" href="/">
                |||Detect</a></div>
                
            <div className="d-flex gap-2">
              <button className="btn text-white">Home</button>
              <button className="btn text-white">About</button>
              <button className="btn text-white">Services</button>
              <button className="btn text-white">Contact</button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container py-5">
          <div className="row align-items-center">
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <img 
                src="/heart-illustration.svg" 
                alt="Heart Illustration" 
                className="img-fluid"
                style={{ maxHeight: '400px' }}
              />
            </motion.div>
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#2C3E50' }}>
                HALO! SELAMAT DATANG DI LAYANAN KESEHATAN JANTUNG
              </h1>
              <p className="lead text-secondary mb-4">
                Deteksi dini penyakit jantung di sini. Ayo mulai mengetahui kondisi jantung Anda sejauh ini! 
                Kami akan membantu Anda memeriksa jantung dengan mengidentifikasi gejala yang 
                dialami berdasarkan keadaan dan kondisi kesehatan yang Anda alami saat ini.
              </p>
              <button 
                className="btn btn-success btn-lg px-4"
                onClick={() => navigate('/predict')}
              >
                Mulai Diagnosis
              </button>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-3 text-center" style={{ backgroundColor: '#FFC107' }}>
          <p className="mb-0">© 2025 CardioRisk Predictor - All rights reserved</p>
        </footer>
      </div>
    </AnimatedPage>
  );
}

export default Home;
