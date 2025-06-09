import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-heart-pulse text-red-600 text-4xl animate-pulse"></i>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Deteksi Dini <span className="text-red-600">Penyakit Kardiovaskular</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Prediksi risiko penyakit kardiovaskular Anda secara cepat dan mudah menggunakan teknologi AI terbaru. 
              Data Anda aman dan hanya digunakan untuk analisis prediksi yang akurat.
            </p>
            
            {/* CTA Button */}
            <Link
              to="/prediction"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-lg rounded-full transform transition hover:scale-105 hover:shadow-xl animate-pulse"
            >
              <i className="fas fa-heart-pulse mr-3 text-xl animate-pulse"></i>
              MULAI PREDIKSI SEKARANG
              <i className="fas fa-arrow-right ml-3"></i>
            </Link>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <i className="fas fa-shield-alt text-green-600"></i>
                <span className="font-medium">Data Aman</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <i className="fas fa-brain text-blue-600"></i>
                <span className="font-medium">AI Technology</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <i className="fas fa-clock text-purple-600"></i>
                <span className="font-medium">Hasil Cepat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Mengapa Memilih IllDetect?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform terdepan untuk deteksi dini risiko kardiovaskular dengan teknologi machine learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lightning-bolt text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Prediksi Cepat</h3>
              <p className="text-gray-600">
                Hasil prediksi dalam hitungan detik dengan akurasi tinggi menggunakan algoritma AI terdepan
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-md text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Akurat & Terpercaya</h3>
              <p className="text-gray-600">
                Dikembangkan berdasarkan data medis terpercaya dengan tingkat akurasi prediksi hingga 85%
              </p>
            </div>

            <div className="text-center p-6 rounded-xl border border-gray-100 hover:shadow-lg transition">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Mudah Digunakan</h3>
              <p className="text-gray-600">
                Interface yang intuitif dan dapat diakses dari perangkat apa pun, kapan pun Anda butuhkan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cara Kerja IllDetect
            </h2>
            <p className="text-gray-600">
              Proses sederhana dalam 3 langkah untuk mendapatkan prediksi risiko kardiovaskular
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-2xl font-bold text-red-600">1</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-edit text-white text-xs"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Input Data</h3>
              <p className="text-gray-600">
                Masukkan data kesehatan seperti usia, tekanan darah, kolesterol, dan gaya hidup
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-2xl font-bold text-blue-600">2</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-cog text-white text-xs"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Analisis AI</h3>
              <p className="text-gray-600">
                Sistem AI menganalisis data Anda menggunakan algoritma machine learning yang canggih
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <span className="text-2xl font-bold text-green-600">3</span>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <i className="fas fa-chart-line text-white text-xs"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Hasil Prediksi</h3>
              <p className="text-gray-600">
                Dapatkan hasil prediksi risiko lengkap dengan rekomendasi kesehatan yang personal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Mulai Deteksi Dini Sekarang
          </h2>
          <p className="text-red-100 max-w-2xl mx-auto mb-8">
            Jangan tunggu sampai terlambat. Lakukan prediksi risiko kardiovaskular sekarang dan jaga kesehatan jantung Anda
          </p>
          <Link
            to="/prediction"
            className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-full hover:bg-gray-100 transition transform hover:scale-105"
          >
            <i className="fas fa-heart-pulse mr-3"></i>
            Mulai Prediksi Gratis
            <i className="fas fa-arrow-right ml-3"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;