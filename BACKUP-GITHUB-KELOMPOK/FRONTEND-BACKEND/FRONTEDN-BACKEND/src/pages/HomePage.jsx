import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="bg-red-50 rounded-full p-6 inline-block mb-6">
                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center relative">
                  <i className="fas fa-heart-pulse text-red-600 text-5xl animate-pulse"></i>
                  <div className="absolute inset-0 rounded-full border-4 border-red-600 opacity-0 animate-ping"></div>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                Deteksi Dini <span className="text-red-600">Penyakit Kardiovaskular</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Prediksi risiko penyakit kardiovaskular Anda secara cepat dan mudah menggunakan teknologi AI. 
                Data Anda aman dan hanya digunakan untuk analisis prediksi.
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
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user-md text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Akurat & Terpercaya</h3>
              <p className="text-gray-600">
                Menggunakan algoritma machine learning yang telah dilatih dengan data medis yang akurat
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Aman & Privasi</h3>
              <p className="text-gray-600">
                Data kesehatan Anda dijaga kerahasiaannya dan tidak disimpan dalam sistem kami
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center transform transition hover:scale-105">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Cepat & Mudah</h3>
              <p className="text-gray-600">
                Hasil prediksi diperoleh dalam hitungan detik dengan input data yang sederhana
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Bagaimana Cara Kerjanya?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Input Data Kesehatan</h3>
                <p className="text-gray-600">
                  Masukkan data kesehatan Anda seperti usia, tekanan darah, kolesterol, dan lainnya
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analisis AI</h3>
                <p className="text-gray-600">
                  Sistem AI menganalisis data Anda dan menghitung tingkat risiko kardiovaskular
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dapatkan Hasil</h3>
                <p className="text-gray-600">
                  Terima hasil prediksi beserta rekomendasi untuk menjaga kesehatan jantung Anda
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Mulai Cek Kesehatan Jantung Anda</h2>
            <p className="text-xl mb-6 opacity-90">
              Deteksi dini adalah kunci untuk menjaga kesehatan kardiovaskular Anda
            </p>
            <Link
              to="/prediction"
              className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-bold text-lg rounded-full transform transition hover:scale-105 hover:shadow-xl"
            >
              <i className="fas fa-stethoscope mr-3"></i>
              CEK SEKARANG GRATIS
              <i className="fas fa-arrow-right ml-3"></i>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage; 