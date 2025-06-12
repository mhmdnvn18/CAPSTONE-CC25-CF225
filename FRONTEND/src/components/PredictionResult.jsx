import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PredictionResult = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
        borderColor: 'border-red-200',
        gradient: 'from-red-500 to-red-600'
      };
    } else {
      return {
        level: 'Risiko Rendah',
        color: 'green',
        icon: 'fa-check-circle',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        gradient: 'from-green-500 to-green-600'
      };
    }
  };

  const risk = getRiskLevel();
  // Fix: Use the actual prediction probability as confidence
  const confidence = prediction.confidence || Math.round((prediction.probability || 0.5) * 100);
  // The confidence should represent the probability of having cardiovascular risk
  const riskProbability = prediction.probability ? Math.round(prediction.probability * 100) : confidence;
  const bmi = prediction.bmi || patientData.bmi || 'N/A';

  // Enhanced recommendations based on risk factors
  const getDetailedRecommendations = () => {
    const recommendations = {
      immediate: [],
      lifestyle: [],
      monitoring: [],
      prevention: []
    };

    if (prediction.risk === 1) {
      recommendations.immediate = [
        'Konsultasi dengan dokter spesialis jantung dalam 1-2 minggu',
        'Lakukan pemeriksaan EKG dan echocardiography',
        'Periksa profil lipid lengkap dan fungsi ginjal',
        'Monitoring tekanan darah harian'
      ];
    } else {
      recommendations.immediate = [
        'Lakukan pemeriksaan kesehatan rutin setiap 6 bulan',
        'Pantau tekanan darah secara berkala',
        'Periksa kolesterol dan gula darah tahunan'
      ];
    }

    // BMI-based recommendations
    const bmiValue = parseFloat(bmi);
    if (bmiValue > 30) {
      recommendations.lifestyle.push('Program penurunan berat badan dengan target 5-10% dari berat badan saat ini');
      recommendations.lifestyle.push('Konsultasi dengan ahli gizi untuk rencana diet');
    } else if (bmiValue > 25) {
      recommendations.lifestyle.push('Penurunan berat badan 2-3 kg untuk mencapai BMI ideal');
    }

    // Blood pressure recommendations
    if (patientData.blood_pressure) {
      const [systolic, diastolic] = patientData.blood_pressure.split('/').map(Number);
      if (systolic > 140 || diastolic > 90) {
        recommendations.lifestyle.push('Diet rendah sodium (kurang dari 2300mg per hari)');
        recommendations.lifestyle.push('Batasi konsumsi alkohol');
        recommendations.monitoring.push('Monitor tekanan darah 2x sehari pada waktu yang sama');
      }
    }

    // Lifestyle factors
    if (patientData.lifestyle?.smoking === 'Yes') {
      recommendations.immediate.push('Program berhenti merokok segera - konsultasi dengan klinik berhenti merokok');
      recommendations.lifestyle.push('Terapi penggantian nikotin jika diperlukan');
    }

    if (patientData.lifestyle?.physical_activity === 'No') {
      recommendations.lifestyle.push('Olahraga aerobik intensitas sedang 150 menit per minggu');
      recommendations.lifestyle.push('Latihan kekuatan 2x per minggu');
      recommendations.lifestyle.push('Mulai dengan jalan kaki 10-15 menit setiap hari');
    }

    // General recommendations
    recommendations.lifestyle = recommendations.lifestyle.concat([
      'Diet Mediterranean: banyak sayuran, buah, ikan, dan minyak zaitun',
      'Kelola stress dengan meditasi atau yoga',
      'Tidur 7-8 jam per malam secara teratur'
    ]);

    recommendations.monitoring = recommendations.monitoring.concat([
      'Catat berat badan setiap minggu',
      'Monitor aktivitas fisik dengan pedometer/smartwatch',
      'Buat diary makanan untuk tracking kalori'
    ]);

    recommendations.prevention = [
      'Vaksinasi influenza tahunan',
      'Edukasi keluarga tentang gejala serangan jantung',
      'Siapkan rencana darurat medis',
      'Bergabung dengan kelompok support kesehatan jantung'
    ];

    return recommendations;
  };

  const recommendations = getDetailedRecommendations();

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'text-blue-600', advice: 'Perlu peningkatan berat badan' };
    if (bmiValue < 25) return { category: 'Normal', color: 'text-green-600', advice: 'Pertahankan berat badan ideal' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'text-yellow-600', advice: 'Perlu penurunan berat badan' };
    return { category: 'Obese', color: 'text-red-600', advice: 'Perlu penurunan berat badan segera' };
  };

  const bmiCategory = getBMICategory(parseFloat(bmi));

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // Fixed tabs array
  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: 'fa-chart-line' },
    { id: 'recommendations', label: 'Rekomendasi', icon: 'fa-clipboard-list' },
    { id: 'lifestyle', label: 'Gaya Hidup', icon: 'fa-heart' },
    { id: 'monitoring', label: 'Monitoring', icon: 'fa-stethoscope' }
  ];

  // Fixed emergency signs array
  const emergencySigns = [
    'Nyeri dada yang menjalar ke lengan/leher',
    'Sesak napas tanpa aktivitas',
    'Pingsan atau pusing berlebihan',
    'Tekanan darah >180/110 mmHg',
    'Detak jantung tidak teratur',
    'Keringat dingin disertai mual'
  ];

  // Patient data items for overview
  const patientDataItems = [
    { label: 'Usia', value: `${patientData.age || 'N/A'} tahun`, icon: 'fa-calendar-alt', color: 'blue' },
    { label: 'Jenis Kelamin', value: patientData.gender || 'N/A', icon: 'fa-venus-mars', color: 'purple' },
    { label: 'Tekanan Darah', value: patientData.blood_pressure || 'N/A', icon: 'fa-heartbeat', color: 'red' },
    { label: 'BMI', value: bmi, icon: 'fa-weight', color: 'green' }
  ];

  // Lifestyle status items
  const lifestyleItems = [
    { 
      label: 'Merokok', 
      value: patientData.lifestyle?.smoking === 'Yes' ? 'Ya' : 'Tidak',
      status: patientData.lifestyle?.smoking === 'Yes',
      icon: 'fa-smoking'
    },
    { 
      label: 'Alkohol', 
      value: patientData.lifestyle?.alcohol === 'Yes' ? 'Ya' : 'Tidak',
      status: patientData.lifestyle?.alcohol === 'Yes',
      icon: 'fa-wine-bottle'
    },
    { 
      label: 'Aktivitas Fisik', 
      value: patientData.lifestyle?.physical_activity === 'Yes' ? 'Aktif' : 'Tidak Aktif',
      status: patientData.lifestyle?.physical_activity === 'Yes',
      icon: 'fa-running'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Result Card with Enhanced Animation */}
      <motion.div 
        className={`${risk.bgColor} ${risk.borderColor} border-2 rounded-2xl p-8 text-center relative overflow-hidden`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Interactive Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${risk.gradient}`}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Interactive Risk Icon */}
        <motion.div
          className={`w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-lg flex items-center justify-center relative z-10 cursor-pointer`}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: prediction.risk === 1 ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.2, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className={`fas ${risk.icon} text-${risk.color}-600 text-4xl`}></i>
        </motion.div>
        
        <motion.h2 
          className={`text-4xl font-bold ${risk.textColor} mb-4 relative z-10`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {risk.level}
        </motion.h2>
        
        {/* Interactive Stats Grid with Dynamic Colors */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-gray-600 text-sm mb-2">Probabilitas Risiko</p>
            <div className={`text-3xl font-bold ${risk.textColor}`}>
              {riskProbability}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {prediction.risk === 1 ? 'Kemungkinan terkena risiko tinggi' : 'Kemungkinan terkena risiko rendah'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <motion.div 
                className={`bg-${risk.color}-600 h-2 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${riskProbability}%` }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-gray-600 text-sm mb-2">BMI</p>
            <div className={`text-3xl font-bold ${bmiCategory.color}`}>
              {bmi}
            </div>
            <p className={`text-sm ${bmiCategory.color} font-medium`}>
              {bmiCategory.category}
            </p>
          </motion.div>
          
          <motion.div 
            className="text-center cursor-pointer"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-gray-600 text-sm mb-2">Status Analisis</p>
            <div className="text-xl font-bold text-purple-600">
              {prediction.source === 'local' ? 'Offline' : 'Online'}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {prediction.source === 'local' ? 'Analisis lokal' : 'Analisis server'}
            </p>
            <div className="flex justify-center mt-1">
              <motion.div
                className={`w-2 h-2 rounded-full ${prediction.source === 'local' ? 'bg-orange-500' : 'bg-green-500'}`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Interactive Tabs Navigation with Dynamic Colors */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-fit px-6 py-4 text-sm font-medium transition-all duration-300 relative ${
                activeTab === tab.id
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center">
                <motion.i 
                  className={`fas ${tab.icon} mr-2`}
                  animate={activeTab === tab.id ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                />
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                  layoutId="activeTab"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="p-6">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Patient Data Summary with Varied Colors */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <motion.i 
                      className="fas fa-user-circle mr-3 text-blue-600"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    Data Pasien
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {patientDataItems.map((item, index) => (
                      <motion.div 
                        key={index}
                        className={`bg-gradient-to-br ${
                          item.label === 'Usia' ? 'from-purple-50 to-purple-100 border-purple-200' :
                          item.label === 'Jenis Kelamin' ? 'from-indigo-50 to-indigo-100 border-indigo-200' :
                          item.label === 'Tekanan Darah' ? 'from-red-50 to-red-100 border-red-200' :
                          'from-blue-50 to-blue-100 border-blue-200'
                        } rounded-lg p-4 relative overflow-hidden cursor-pointer border`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-gray-600">{item.label}</p>
                          <motion.i 
                            className={`fas ${item.icon} ${
                              item.label === 'Usia' ? 'text-purple-600' :
                              item.label === 'Jenis Kelamin' ? 'text-indigo-600' :
                              item.label === 'Tekanan Darah' ? 'text-red-600' :
                              'text-blue-600'
                            }`}
                            whileHover={{ rotate: 10, scale: 1.2 }}
                          />
                        </div>
                        <p className={`font-semibold text-lg ${
                          item.label === 'Usia' ? 'text-purple-700' :
                          item.label === 'Jenis Kelamin' ? 'text-indigo-700' :
                          item.label === 'Tekanan Darah' ? 'text-red-700' :
                          'text-blue-700'
                        }`}>{item.value}</p>
                        {item.label === 'BMI' && (
                          <p className={`text-xs ${bmiCategory.color} mt-1`}>{bmiCategory.advice}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors with Warning Colors */}
                {mlInsights?.risk_factors && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <motion.i 
                        className="fas fa-exclamation-triangle text-orange-600 mr-2"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      Faktor Risiko Teridentifikasi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {mlInsights.risk_factors.map((factor, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 cursor-pointer"
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <motion.i 
                            className="fas fa-exclamation-triangle text-orange-600 mr-3"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          />
                          <span className="text-orange-800">{factor}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <motion.i 
                      className="fas fa-exclamation-circle mr-3 text-red-600"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    Tindakan Segera
                  </h3>
                  <div className="space-y-3">
                    {recommendations.immediate.map((rec, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-start p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.i 
                          className="fas fa-arrow-right text-red-600 mt-1 mr-3"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        />
                        <span className="text-red-800">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <motion.i 
                      className="fas fa-shield-alt mr-3 text-green-600"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    Pencegahan Jangka Panjang
                  </h3>
                  <div className="space-y-3">
                    {recommendations.prevention.map((rec, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-start p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.i 
                          className="fas fa-check-circle text-green-600 mt-1 mr-3"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        />
                        <span className="text-green-800">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'lifestyle' && (
              <div className="space-y-6">
                {/* Current Lifestyle Status with Traffic Light Colors */}
                {patientData.lifestyle && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <motion.i 
                        className="fas fa-heart mr-3 text-pink-600"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      Status Gaya Hidup Saat Ini
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {lifestyleItems.map((item, index) => (
                        <motion.div 
                          key={index}
                          className={`bg-gradient-to-br ${
                            item.label === 'Aktivitas Fisik' 
                              ? (item.status ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200')
                              : (item.status ? 'from-red-50 to-red-100 border-red-200' : 'from-green-50 to-green-100 border-green-200')
                          } rounded-lg p-4 cursor-pointer border`}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <p className="text-sm text-gray-600 mb-2">{item.label}</p>
                          <div className="flex items-center">
                            <motion.i 
                              className={`fas ${
                                item.label === 'Aktivitas Fisik' 
                                  ? (item.status ? 'fa-check-circle text-green-600' : 'fa-times-circle text-red-600')
                                  : (item.status ? 'fa-times-circle text-red-600' : 'fa-check-circle text-green-600')
                              } mr-2`}
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                            />
                            <span className={`font-semibold ${
                              item.label === 'Aktivitas Fisik' 
                                ? (item.status ? 'text-green-600' : 'text-red-600')
                                : (item.status ? 'text-red-600' : 'text-green-600')
                            }`}>
                              {item.value}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lifestyle Recommendations with Varied Colors */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <motion.i 
                      className="fas fa-lightbulb mr-3 text-yellow-600"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Rekomendasi Perubahan Gaya Hidup
                  </h3>
                  <div className="space-y-3">
                    {recommendations.lifestyle.map((rec, index) => (
                      <motion.div 
                        key={index}
                        className={`flex items-start p-4 bg-gradient-to-r ${
                          index % 3 === 0 ? 'from-blue-50 to-blue-100 border-blue-200' :
                          index % 3 === 1 ? 'from-purple-50 to-purple-100 border-purple-200' :
                          'from-indigo-50 to-indigo-100 border-indigo-200'
                        } rounded-lg border cursor-pointer`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.i 
                          className={`fas fa-star ${
                            index % 3 === 0 ? 'text-blue-600' :
                            index % 3 === 1 ? 'text-purple-600' :
                            'text-indigo-600'
                          } mt-1 mr-3`}
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                        />
                        <span className={`${
                          index % 3 === 0 ? 'text-blue-800' :
                          index % 3 === 1 ? 'text-purple-800' :
                          'text-indigo-800'
                        }`}>{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <motion.i 
                      className="fas fa-chart-line mr-3 text-purple-600"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Jadwal Monitoring Kesehatan
                  </h3>
                  <div className="space-y-3">
                    {recommendations.monitoring.map((rec, index) => (
                      <motion.div 
                        key={index}
                        className={`flex items-start p-4 bg-gradient-to-r ${
                          index % 4 === 0 ? 'from-cyan-50 to-cyan-100 border-cyan-200' :
                          index % 4 === 1 ? 'from-teal-50 to-teal-100 border-teal-200' :
                          index % 4 === 2 ? 'from-emerald-50 to-emerald-100 border-emerald-200' :
                          'from-lime-50 to-lime-100 border-lime-200'
                        } rounded-lg border cursor-pointer`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.i 
                          className={`fas fa-clipboard-check ${
                            index % 4 === 0 ? 'text-cyan-600' :
                            index % 4 === 1 ? 'text-teal-600' :
                            index % 4 === 2 ? 'text-emerald-600' :
                            'text-lime-600'
                          } mt-1 mr-3`}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        />
                        <span className={`${
                          index % 4 === 0 ? 'text-cyan-800' :
                          index % 4 === 1 ? 'text-teal-800' :
                          index % 4 === 2 ? 'text-emerald-800' :
                          'text-lime-800'
                        }`}>{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Emergency Warning Signs with Red Theme */}
                <motion.div 
                  className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="font-bold text-red-800 mb-3 flex items-center">
                    <motion.i 
                      className="fas fa-ambulance mr-2 text-red-600"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Tanda Bahaya - Segera Hubungi Dokter
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {emergencySigns.map((sign, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center cursor-pointer"
                        whileHover={{ scale: 1.02, x: 5 }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.i 
                          className="fas fa-exclamation-triangle text-red-600 mr-2"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        />
                        <span className="text-red-800 text-sm">{sign}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Source Information with Blue Theme */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center cursor-pointer border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <p className="text-sm text-blue-700">
          <motion.i 
            className="fas fa-info-circle mr-2 text-blue-600"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          Hasil estimasi risiko kardiovaskular sebagai alat bantu skrining awal
        </p>
        <p className="text-xs text-blue-600 mt-2 font-medium">
          ⚠️ Hasil ini hanya untuk referensi. Konsultasikan dengan dokter untuk diagnosis yang akurat.
        </p>
      </motion.div>
    </div>
  );
};

export default PredictionResult;