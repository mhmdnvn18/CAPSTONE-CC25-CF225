import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PredictionPage from './pages/PredictionPage';
import ResultPage from './pages/ResultPage';

// CardioPredict Main Application Component
function App() {
  // Set current year effect (equivalent to DOMContentLoaded in app.js)
  useEffect(() => {
    // Any app-level initialization can go here
    console.log('IllDetect - Cardiovascular Diagnosis Detector initialized');
    
    // Set document title
    document.title = 'IllDetect - Cardiovascular Diagnosis Detector';
    
    // Add meta description if not present
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Deteksi dini risiko penyakit kardiovaskular secara online';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/result" element={<ResultPage />} />
            {/* Fallback route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

// 404 Not Found Page Component
function NotFoundPage() {
  return (
    <main className="flex-grow container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-heart-crack text-red-600 text-4xl"></i>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. 
          Silakan kembali ke beranda atau mulai prediksi kesehatan jantung Anda.
        </p>
        <div className="space-y-3">
          <a
            href="/"
            className="block w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition"
          >
            <i className="fas fa-home mr-2"></i>
            Kembali ke Beranda
          </a>
          <a
            href="/prediction"
            className="block w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition"
          >
            <i className="fas fa-heart-pulse mr-2"></i>
            Mulai Prediksi
          </a>
        </div>
      </div>
    </main>
  );
}

export default App;
