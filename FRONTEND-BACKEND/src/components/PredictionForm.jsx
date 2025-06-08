import React, { useState, useEffect } from 'react';
import CardiovascularAPI, { SupabaseService } from '../services/api';
import ApiStatusMonitor from './ApiStatusMonitor';

// Mock prediction function dengan Supabase save
function predictCardiovascularRisk(formData) {
  // Calculate BMI
  const heightInM = formData.height / 100;
  const bmi = formData.weight / (heightInM * heightInM);
  
  // Risk factors based on dataset features
  const riskFactors = [
    formData.age > 55 ? 25 : formData.age > 45 ? 15 : 5,
    formData.gender === 2 ? 10 : 5,
    bmi > 30 ? 20 : bmi > 25 ? 10 : 0,
    formData.ap_hi > 140 ? 25 : formData.ap_hi > 120 ? 15 : 5,
    formData.ap_lo > 90 ? 20 : formData.ap_lo > 80 ? 10 : 5,
    formData.cholesterol === 3 ? 25 : formData.cholesterol === 2 ? 15 : 0,
    formData.gluc === 3 ? 20 : formData.gluc === 2 ? 10 : 0,
    formData.smoke === 1 ? 15 : 0,
    formData.alco === 1 ? 5 : 0,
    formData.active === 0 ? 10 : 0
  ];
  
  const totalRisk = riskFactors.reduce((sum, risk) => sum + risk, 0);
  const riskPercentage = Math.min(Math.max(totalRisk, 10), 95);
  
  let riskLevel = 'Rendah';
  let riskColor = 'green';
  let risk = 0;
  
  if (riskPercentage >= 65) {
    riskLevel = 'Tinggi';
    riskColor = 'red';
    risk = 1;
  } else if (riskPercentage >= 40) {
    riskLevel = 'Sedang';
    riskColor = 'yellow';
  }
  
  return {
    percentage: riskPercentage,
    level: riskLevel,
    color: riskColor,
    bmi: bmi.toFixed(1),
    risk: risk,
    formData: formData
  };
}

function PredictionForm({ onResult }) {
  const [formData, setFormData] = useState({
    age: '', gender: '', height: '', weight: '',
    ap_hi: '', ap_lo: '', cholesterol: '', gluc: '',
    smoke: '', alco: '', active: ''
  });

  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const initializeApi = async () => {
      await checkApiHealth();
    };
    initializeApi();
  }, []);

  const checkApiHealth = async () => {
    try {
      console.log('🔄 Checking API health...');
      const status = await CardiovascularAPI.getConnectionStatus();
      setApiStatus(status.connected ? 'connected' : 'disconnected');
      
      console.log('✅ API Status Check Result:', status);
      return status;
    } catch (error) {
      setApiStatus('disconnected');
      console.error('❌ API Health Check Failed:', error);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : (isNaN(value) ? value : parseInt(value))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['age', 'gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active'];
    const emptyFields = requiredFields.filter(field => formData[field] === '' || formData[field] === null || formData[field] === undefined);
    
    if (emptyFields.length > 0) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }
    
    setLoading(true);
    
    try {
      let prediction;
      
      if (apiStatus === 'connected') {
        // Try Flask API first (akan otomatis save ke Supabase)
        console.log('🔄 Using Flask API for prediction');
        try {
          const apiResponse = await CardiovascularAPI.predict(formData);
          
          // Convert Flask response to match existing format
          const heightInM = formData.height / 100;
          const bmi = formData.weight / (heightInM * heightInM);
          
          prediction = {
            percentage: Math.round(apiResponse.prediction.confidence),
            level: apiResponse.prediction.risk_label === 'High Risk' ? 'Tinggi' : 'Rendah',
            color: apiResponse.prediction.risk === 1 ? 'red' : 'green',
            bmi: bmi.toFixed(1),
            risk: apiResponse.prediction.risk,
            formData: formData,
            apiData: {
              source: 'Flask API',
              probability: apiResponse.prediction.probability,
              confidence: apiResponse.prediction.confidence,
              risk: apiResponse.prediction.risk,
              dataSaved: true // Flask API sudah save ke Supabase
            }
          };
          
          console.log('✅ Flask API prediction successful:', prediction);
          
        } catch (apiError) {
          console.warn('⚠️ Flask API failed, falling back to mock prediction:', apiError.message);
          prediction = await handleMockPrediction(formData, 'mock_api_fallback');
        }
      } else {
        // Use mock prediction when API disconnected
        console.log('🔄 Using mock prediction (API not connected)');
        prediction = await handleMockPrediction(formData, 'mock_offline');
      }
      
      // Call onResult callback
      console.log('📤 Sending prediction result:', prediction);
      onResult(prediction);
      
    } catch (error) {
      console.error('💥 Unexpected error during prediction:', error);
      alert('Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function untuk handle mock prediction dengan Supabase save
  const handleMockPrediction = async (formData, source) => {
    try {
      const mockResult = predictCardiovascularRisk(formData);
      
      // Save mock prediction to Supabase
      try {
        const userIP = await SupabaseService.getUserIP();
        await SupabaseService.savePrediction(formData, mockResult, {
          source: source,
          userIP,
          sessionId: CardiovascularAPI.getConnectionInfo().sessionId
        });
        
        mockResult.apiData = { 
          source: source,
          dataSaved: true,
          fallback: true 
        };
      } catch (supabaseError) {
        console.warn('Failed to save mock prediction to Supabase:', supabaseError);
        mockResult.apiData = { 
          source: source,
          dataSaved: false,
          fallback: true,
          error: supabaseError.message
        };
      }
      
      return mockResult;
    } catch (error) {
      console.error('Mock prediction failed:', error);
      throw error;
    }
  };

  // Manual refresh API status function
  const refreshApiStatus = async () => {
    console.log('🔄 Manual API status refresh...');
    await checkApiHealth();
  };

  return (
    <div>
      {/* Add API Status Monitor */}
      <ApiStatusMonitor />
      
      {/* Debug Info (only visible in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
          <div className="flex justify-between items-center">
            <span>API Status: <strong className={apiStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>{apiStatus}</strong></span>
            <button 
              onClick={refreshApiStatus}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
      
      {/* Form Fields */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Age */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Usia (tahun)</label>
            <input
              type="number"
              name="age"
              min="0"
              max="120"
              value={formData.age}
              onChange={handleChange}
              placeholder="Masukkan usia Anda"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>
          
          {/* Height */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Tinggi Badan (cm)</label>
            <input
              type="number"
              name="height"
              min="100"
              max="250"
              value={formData.height}
              onChange={handleChange}
              placeholder="Contoh: 170"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>
          
          {/* Weight */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Berat Badan (kg)</label>
            <input
              type="number"
              name="weight"
              min="30"
              max="200"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Contoh: 70"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>
          
          {/* Gender */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Jenis Kelamin</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value={1}>Perempuan</option>
              <option value={2}>Laki-laki</option>
            </select>
          </div>
          
          {/* Blood Pressure Systolic */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Tekanan Darah Sistolik (mmHg)</label>
            <input
              type="number"
              name="ap_hi"
              min="80"
              max="200"
              value={formData.ap_hi}
              onChange={handleChange}
              placeholder="Contoh: 120"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>
          
          {/* Blood Pressure Diastolic */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Tekanan Darah Diastolik (mmHg)</label>
            <input
              type="number"
              name="ap_lo"
              min="40"
              max="120"
              value={formData.ap_lo}
              onChange={handleChange}
              placeholder="Contoh: 80"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            />
          </div>
          
          {/* Cholesterol */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Level Kolesterol</label>
            <select
              name="cholesterol"
              value={formData.cholesterol}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Pilih Level Kolesterol</option>
              <option value={1}>Normal</option>
              <option value={2}>Di atas normal</option>
              <option value={3}>Jauh di atas normal</option>
            </select>
          </div>
          
          {/* Glucose */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Level Glukosa</label>
            <select
              name="gluc"
              value={formData.gluc}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Pilih Level Glukosa</option>
              <option value={1}>Normal</option>
              <option value={2}>Di atas normal</option>
              <option value={3}>Jauh di atas normal</option>
            </select>
          </div>
          
          {/* Smoking */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Merokok</label>
            <select
              name="smoke"
              value={formData.smoke}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Pilih Kebiasaan Merokok</option>
              <option value={0}>Tidak</option>
              <option value={1}>Ya</option>
            </select>
          </div>
          
          {/* Alcohol */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Konsumsi Alkohol</label>
            <select
              name="alco"
              value={formData.alco}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Pilih Kebiasaan Alkohol</option>
              <option value={0}>Tidak</option>
              <option value={1}>Ya</option>
            </select>
          </div>
          
          {/* Physical Activity */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2 font-medium">Aktivitas Fisik</label>
            <select
              name="active"
              value={formData.active}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Pilih Tingkat Aktivitas Fisik</option>
              <option value={0}>Tidak Aktif</option>
              <option value={1}>Aktif</option>
            </select>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full flex items-center animate-pulse transform transition hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="mr-3">
              <i className="fas fa-heart-pulse animate-pulse text-xl"></i>
            </div>
            {loading ? 'MEMPROSES...' : 'PREDIKSI SEKARANG'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PredictionForm;
