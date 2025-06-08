import React, { useState, useEffect } from 'react';
import CardiovascularAPI from '../services/api';

function PredictionForm({ onResult }) {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    ap_hi: '',
    ap_lo: '',
    cholesterol: '',
    gluc: '',
    smoke: '',
    alco: '',
    active: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.age) newErrors.age = 'Usia harus diisi';
      if (!formData.gender) newErrors.gender = 'Jenis kelamin harus dipilih';
      if (!formData.height) newErrors.height = 'Tinggi badan harus diisi';
      if (!formData.weight) newErrors.weight = 'Berat badan harus diisi';
    } else if (step === 2) {
      if (!formData.ap_hi) newErrors.ap_hi = 'Tekanan darah sistolik harus diisi';
      if (!formData.ap_lo) newErrors.ap_lo = 'Tekanan darah diastolik harus diisi';
      if (!formData.cholesterol) newErrors.cholesterol = 'Level kolesterol harus dipilih';
      if (!formData.gluc) newErrors.gluc = 'Level glukosa harus dipilih';
    } else if (step === 3) {
      if (!formData.smoke) newErrors.smoke = 'Status merokok harus dipilih';
      if (!formData.alco) newErrors.alco = 'Status alkohol harus dipilih';
      if (!formData.active) newErrors.active = 'Status aktivitas fisik harus dipilih';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert form data to match API format
      const apiData = {
        age: parseInt(formData.age),
        gender: parseInt(formData.gender),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        ap_hi: parseInt(formData.ap_hi),
        ap_lo: parseInt(formData.ap_lo),
        cholesterol: parseInt(formData.cholesterol),
        gluc: parseInt(formData.gluc),
        smoke: parseInt(formData.smoke),
        alco: parseInt(formData.alco),
        active: parseInt(formData.active)
      };

      console.log('📤 Submitting prediction data:', apiData);

      let prediction;
      
      try {
        // Try backend API first
        const result = await CardiovascularAPI.predict(apiData);
        
        // Convert API response to match expected format
        const heightInM = apiData.height / 100;
        const bmi = apiData.weight / (heightInM * heightInM);
        
        prediction = {
          percentage: Math.round(result.prediction.confidence),
          level: result.prediction.risk_label === 'High Risk' ? 'Tinggi' : 'Rendah',
          color: result.prediction.risk === 1 ? 'red' : 'green',
          bmi: bmi.toFixed(1),
          risk: result.prediction.risk,
          formData: apiData,
          apiData: {
            source: 'Hapi.js API',
            probability: result.prediction.probability,
            confidence: result.prediction.confidence,
            risk: result.prediction.risk,
            dataSaved: result.saved
          }
        };
        
        console.log('✅ API prediction successful:', prediction);
        
      } catch (error) {
        console.warn('⚠️ API failed, using local prediction:', error);
        
        // Fallback to local prediction
        const heightInM = apiData.height / 100;
        const bmi = apiData.weight / (heightInM * heightInM);
        
        const riskFactors = [
          apiData.age > 55 ? 25 : apiData.age > 45 ? 15 : 5,
          apiData.gender === 2 ? 10 : 5,
          bmi > 30 ? 20 : bmi > 25 ? 10 : 0,
          apiData.ap_hi > 140 ? 25 : apiData.ap_hi > 120 ? 15 : 5,
          apiData.ap_lo > 90 ? 20 : apiData.ap_lo > 80 ? 10 : 5,
          apiData.cholesterol === 3 ? 25 : apiData.cholesterol === 2 ? 15 : 0,
          apiData.gluc === 3 ? 20 : apiData.gluc === 2 ? 10 : 0,
          apiData.smoke === 1 ? 15 : 0,
          apiData.alco === 1 ? 5 : 0,
          apiData.active === 0 ? 10 : 0
        ];
        
        const totalRisk = riskFactors.reduce((sum, risk) => sum + risk, 0);
        const confidence = Math.min(Math.max(totalRisk, 10), 95);
        const risk = confidence >= 65 ? 1 : 0;
        
        prediction = {
          percentage: confidence,
          level: risk === 1 ? 'Tinggi' : 'Rendah',
          color: risk === 1 ? 'red' : 'green',
          bmi: bmi.toFixed(1),
          risk: risk,
          formData: apiData,
          apiData: {
            source: 'Local Prediction',
            probability: confidence / 100,
            confidence: confidence,
            risk: risk,
            dataSaved: false
          }
        };
        
        console.log('✅ Local prediction successful:', prediction);
      }
      
      // Store result in sessionStorage
      sessionStorage.setItem('predictionResult', JSON.stringify(prediction));
      console.log('💾 Prediction result saved to sessionStorage');
      
      // Call onResult callback
      onResult(prediction);
      
    } catch (error) {
      console.error('💥 Unexpected error during prediction:', error);
      alert('Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Data Pribadi</h3>
        <p className="text-gray-600">Masukkan informasi dasar tentang diri Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-calendar-alt mr-2 text-gray-400"></i>
            Usia (tahun)
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.age ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Contoh: 45"
            min="1"
            max="120"
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-venus-mars mr-2 text-gray-400"></i>
            Jenis Kelamin
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="1">Perempuan</option>
            <option value="2">Laki-laki</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-ruler-vertical mr-2 text-gray-400"></i>
            Tinggi Badan (cm)
          </label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.height ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Contoh: 170"
            min="100"
            max="250"
          />
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-weight mr-2 text-gray-400"></i>
            Berat Badan (kg)
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.weight ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Contoh: 70"
            min="30"
            max="200"
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Data Medis</h3>
        <p className="text-gray-600">Masukkan informasi kesehatan dan hasil pemeriksaan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-heartbeat mr-2 text-gray-400"></i>
            Tekanan Darah Sistolik (mmHg)
          </label>
          <input
            type="number"
            name="ap_hi"
            value={formData.ap_hi}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.ap_hi ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Contoh: 120"
            min="80"
            max="250"
          />
          {errors.ap_hi && <p className="text-red-500 text-sm mt-1">{errors.ap_hi}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-heartbeat mr-2 text-gray-400"></i>
            Tekanan Darah Diastolik (mmHg)
          </label>
          <input
            type="number"
            name="ap_lo"
            value={formData.ap_lo}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.ap_lo ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Contoh: 80"
            min="40"
            max="150"
          />
          {errors.ap_lo && <p className="text-red-500 text-sm mt-1">{errors.ap_lo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-vial mr-2 text-gray-400"></i>
            Level Kolesterol
          </label>
          <select
            name="cholesterol"
            value={formData.cholesterol}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.cholesterol ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Pilih level kolesterol</option>
            <option value="1">Normal</option>
            <option value="2">Di atas normal</option>
            <option value="3">Jauh di atas normal</option>
          </select>
          {errors.cholesterol && <p className="text-red-500 text-sm mt-1">{errors.cholesterol}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <i className="fas fa-cube mr-2 text-gray-400"></i>
            Level Glukosa
          </label>
          <select
            name="gluc"
            value={formData.gluc}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
              errors.gluc ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Pilih level glukosa</option>
            <option value="1">Normal</option>
            <option value="2">Di atas normal</option>
            <option value="3">Jauh di atas normal</option>
          </select>
          {errors.gluc && <p className="text-red-500 text-sm mt-1">{errors.gluc}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Gaya Hidup</h3>
        <p className="text-gray-600">Informasi tentang kebiasaan dan aktivitas sehari-hari</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <i className="fas fa-smoking mr-2 text-gray-400"></i>
            Status Merokok
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.smoke === '0' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="smoke"
                value="0"
                checked={formData.smoke === '0'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-3"></i>
                <span className="font-medium">Tidak Merokok</span>
              </div>
            </label>
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.smoke === '1' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="smoke"
                value="1"
                checked={formData.smoke === '1'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <i className="fas fa-times-circle text-red-500 mr-3"></i>
                <span className="font-medium">Merokok</span>
              </div>
            </label>
          </div>
          {errors.smoke && <p className="text-red-500 text-sm mt-1">{errors.smoke}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <i className="fas fa-wine-bottle mr-2 text-gray-400"></i>
            Konsumsi Alkohol
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.alco === '0' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="alco"
                value="0"
                checked={formData.alco === '0'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-3"></i>
                <span className="font-medium">Tidak Mengonsumsi</span>
              </div>
            </label>
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.alco === '1' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="alco"
                value="1"
                checked={formData.alco === '1'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-orange-500 mr-3"></i>
                <span className="font-medium">Mengonsumsi</span>
              </div>
            </label>
          </div>
          {errors.alco && <p className="text-red-500 text-sm mt-1">{errors.alco}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <i className="fas fa-running mr-2 text-gray-400"></i>
            Aktivitas Fisik
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.active === '1' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="active"
                value="1"
                checked={formData.active === '1'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <i className="fas fa-check-circle text-blue-500 mr-3"></i>
                <span className="font-medium">Aktif Berolahraga</span>
              </div>
            </label>
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.active === '0' ? 'border-gray-500 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="active"
                value="0"
                checked={formData.active === '0'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <i className="fas fa-times-circle text-gray-500 mr-3"></i>
                <span className="font-medium">Tidak Aktif</span>
              </div>
            </label>
          </div>
          {errors.active && <p className="text-red-500 text-sm mt-1">{errors.active}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Langkah {currentStep} dari {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-6 py-3 rounded-lg font-medium transition ${
            currentStep === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Sebelumnya
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
          >
            Selanjutnya
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-medium transition flex items-center ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Memproses...
              </>
            ) : (
              <>
                <i className="fas fa-heart-pulse mr-2"></i>
                Prediksi Risiko
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

export default PredictionForm;