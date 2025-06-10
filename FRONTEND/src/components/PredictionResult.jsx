import React from 'react';
import { motion } from 'framer-motion';

const PredictionResult = ({ result }) => {
  if (!result) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Tidak ada data hasil prediksi</p>
      </div>
    );
  }

  // Extract data from result object
  const prediction = result.prediction || result;
  const patientData = result.patient_data || {};
  const mlInsights = result.ml_insights || result.data;

  const getRiskLevel = () => {
    if (prediction.risk === 1 || prediction.risk_label === 'High Risk') {
      return {
        level: 'Risiko Tinggi',
        color: 'red',
        icon: 'fa-exclamation-triangle',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      };
    } else {
      return {
        level: 'Risiko Rendah',
        color: 'green',
        icon: 'fa-check-circle',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    }
  };

  const risk = getRiskLevel();
  const confidence = prediction.confidence || Math.round((prediction.probability || 0.5) * 100);
  const bmi = prediction.bmi || patientData.bmi || 'N/A';

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <motion.div 
        className={`${risk.bgColor} ${risk.borderColor} border-2 rounded-2xl p-8 text-center`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-lg flex items-center justify-center`}
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <i className={`fas ${risk.icon} text-${risk.color}-600 text-4xl`}></i>
        </motion.div>
        
        <h2 className={`text-3xl font-bold ${risk.textColor} mb-4`}>
          {risk.level}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Tingkat Keyakinan</p>
            <div className={`text-2xl font-bold ${risk.textColor}`}>
              {confidence}%
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">BMI</p>
            <div className={`text-2xl font-bold ${risk.textColor}`}>
              {bmi}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Patient Data */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-user-circle mr-3 text-blue-600"></i>
          Data Pasien
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Usia</p>
            <p className="font-semibold">{patientData.age || 'N/A'} tahun</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Jenis Kelamin</p>
            <p className="font-semibold">{patientData.gender || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Tekanan Darah</p>
            <p className="font-semibold">{patientData.blood_pressure || 'N/A'} mmHg</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Kolesterol</p>
            <p className="font-semibold">{patientData.cholesterol || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Glukosa</p>
            <p className="font-semibold">{patientData.glucose || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">BMI</p>
            <p className="font-semibold">{bmi}</p>
          </div>
        </div>
      </motion.div>

      {/* Lifestyle Factors */}
      {patientData.lifestyle && (
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-heart mr-3 text-red-600"></i>
            Gaya Hidup
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Merokok</p>
              <p className={`font-semibold ${patientData.lifestyle.smoking === 'Yes' ? 'text-red-600' : 'text-green-600'}`}>
                {patientData.lifestyle.smoking === 'Yes' ? 'Ya' : 'Tidak'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Alkohol</p>
              <p className={`font-semibold ${patientData.lifestyle.alcohol === 'Yes' ? 'text-orange-600' : 'text-green-600'}`}>
                {patientData.lifestyle.alcohol === 'Yes' ? 'Ya' : 'Tidak'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Aktivitas Fisik</p>
              <p className={`font-semibold ${patientData.lifestyle.physical_activity === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                {patientData.lifestyle.physical_activity === 'Yes' ? 'Aktif' : 'Tidak Aktif'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {mlInsights && (mlInsights.recommendations || mlInsights.result_message) && (
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-lightbulb mr-3 text-yellow-600"></i>
            Rekomendasi
          </h3>
          <div className="space-y-3">
            {mlInsights.result_message && (
              <div className={`p-4 rounded-lg ${risk.bgColor} ${risk.borderColor} border`}>
                <p className={`font-semibold ${risk.textColor}`}>
                  {mlInsights.result_message}
                </p>
              </div>
            )}
            {mlInsights.recommendations && Array.isArray(mlInsights.recommendations) && (
              <ul className="space-y-2">
                {mlInsights.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <i className="fas fa-check-circle text-green-600 mt-1 mr-3"></i>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}

      {/* Source Information */}
      <motion.div 
        className="bg-gray-50 rounded-xl p-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <p className="text-sm text-gray-600">
          <i className="fas fa-info-circle mr-2"></i>
          Prediksi dibuat menggunakan: {prediction.source === 'local' ? 'Model Lokal' : 'AI Backend'}
          {mlInsights?.interpretation && (
            <span className="block mt-1">{mlInsights.interpretation}</span>
          )}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          ⚠️ Hasil ini hanya untuk referensi. Konsultasikan dengan dokter untuk diagnosis yang akurat.
        </p>
      </motion.div>
    </div>
  );
};

export default PredictionResult;