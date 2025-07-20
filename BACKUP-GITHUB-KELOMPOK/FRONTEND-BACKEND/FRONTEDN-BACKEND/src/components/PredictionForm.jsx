import React, { useState } from 'react';

// Mock prediction function (same logic as app.js)
function predictCardiovascularRisk(formData) {
  // Calculate BMI
  const heightInM = formData.height / 100;
  const bmi = formData.weight / (heightInM * heightInM);
  
  // Risk factors based on dataset features
  const riskFactors = [
    formData.age > 55 ? 25 : formData.age > 45 ? 15 : 5, // Age factor
    formData.gender === 2 ? 10 : 5, // Male gender higher risk
    bmi > 30 ? 20 : bmi > 25 ? 10 : 0, // BMI factor
    formData.ap_hi > 140 ? 25 : formData.ap_hi > 120 ? 15 : 5, // Systolic BP
    formData.ap_lo > 90 ? 20 : formData.ap_lo > 80 ? 10 : 5, // Diastolic BP
    formData.cholesterol === 3 ? 25 : formData.cholesterol === 2 ? 15 : 0, // Cholesterol
    formData.gluc === 3 ? 20 : formData.gluc === 2 ? 10 : 0, // Glucose
    formData.smoke === 1 ? 15 : 0, // Smoking
    formData.alco === 1 ? 5 : 0, // Alcohol
    formData.active === 0 ? 10 : 0 // Physical inactivity
  ];
  
  const totalRisk = riskFactors.reduce((sum, risk) => sum + risk, 0);
  const riskPercentage = Math.min(Math.max(totalRisk, 10), 95); // Between 10-95%
  
  let riskLevel = 'Rendah';
  let riskColor = 'green';
  
  if (riskPercentage >= 65) {
    riskLevel = 'Tinggi';
    riskColor = 'red';
  } else if (riskPercentage >= 40) {
    riskLevel = 'Sedang';
    riskColor = 'yellow';
  }
  
  return {
    percentage: riskPercentage,
    level: riskLevel,
    color: riskColor,
    bmi: bmi.toFixed(1),
    formData: formData
  };
}

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
      // Get prediction
      const prediction = predictCardiovascularRisk(formData);
      
      // Call onResult callback
      onResult(prediction);
      
    } catch (error) {
      console.error('Error during prediction:', error);
      alert('Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Row 1: Age | Height */}
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
        
        {/* Row 2: Weight | Gender */}
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
        
        {/* Row 3: Blood Pressure */}
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
        
        {/* Row 4: Cholesterol | Glucose */}
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
        
        {/* Row 5: Smoking | Alcohol */}
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
        
        {/* Row 6: Physical Activity */}
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
  );
}

export default PredictionForm;
