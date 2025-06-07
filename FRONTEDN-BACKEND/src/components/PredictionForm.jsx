import React, { useState } from 'react';
import { validateInput } from '../utils/validateInput';
import { predict } from '../services/model';
import { yearsToDays } from '../utils/convertAge';

const initialState = {
  age: '',             // Age in days
  height: '',          // Height in cm
  weight: '',          // Weight in kg
  gender: '',          // Gender (categorical)
  systolic: '',        // Systolic blood pressure
  diastolic: '',       // Diastolic blood pressure
  cholesterol: '',     // 1: normal, 2: above normal, 3: well above normal
  glucose: '',         // 1: normal, 2: above normal, 3: well above normal
  smoking: '',         // binary
  alcohol: '',         // binary
  activity: '',        // binary
  cardio: ''          // Target variable (binary)
};

function PredictionForm({ onResult }) {
  const [input, setInput] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    const inputWithDays = {
        ...input,
        age: yearsToDays(Number(input.age))
    };
    
    const valid = validateInput(inputWithDays);
    if (!valid.ok) {
        setError(valid.msg);
        return;
    }
    
    setLoading(true);
    try {
        const result = await predict(input);
        console.log('Prediction result:', result);
        
        // Save to localStorage and redirect
        localStorage.setItem('predictionResult', JSON.stringify({
            ...result,
            timestamp: new Date().toISOString()
        }));
        
        window.location.href = '/result.html';
    } catch (err) {
        console.error('Prediction error:', err);
        setError(err.message || 'Gagal melakukan prediksi.');
    }
    setLoading(false);
  };

  // Helper function to generate risk factors based on input
  function generateRiskFactors(input) {
    const factors = [];
    
    if (input.systolic > 140) factors.push("Tekanan darah sistolik tinggi");
    if (input.diastolic > 90) factors.push("Tekanan darah diastolik tinggi");
    if (input.cholesterol === '3') factors.push("Kolesterol sangat tinggi");
    if (input.glucose === '3') factors.push("Glukosa sangat tinggi");
    if (input.smoking === '1') factors.push("Merokok");
    if (input.alcohol === '1') factors.push("Konsumsi alkohol");
    if (input.activity === '0') factors.push("Kurang aktivitas fisik");
    
    return factors;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-4 shadow-lg p-4 border border-primary">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Usia (tahun)</label>
          <input
            type="number"
            name="age"
            value={input.age}
            onChange={handleChange}
            className="form-control"
            required
            min="1"
            max="120"
            placeholder="Masukkan usia dalam tahun"
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label">Tinggi Badan (cm)</label>
          <input
            type="number"
            name="height"
            value={input.height}
            onChange={handleChange}
            className="form-control"
            required
            min="1"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Berat Badan (kg)</label>
          <input
            type="number"
            name="weight"
            value={input.weight}
            onChange={handleChange}
            className="form-control"
            required
            step="0.1"
            min="1"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Jenis Kelamin</label>
          <select name="gender" value={input.gender} onChange={handleChange} className="form-select" required>
            <option value="">Pilih</option>
            <option value="1">Laki-laki</option>
            <option value="0">Perempuan</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Tekanan Darah Sistolik (mmHg)</label>
          <input
            type="number"
            name="systolic"
            value={input.systolic}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Tekanan Darah Diastolik (mmHg)</label>
          <input
            type="number"
            name="diastolic"
            value={input.diastolic}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Level Kolesterol</label>
          <select name="cholesterol" value={input.cholesterol} onChange={handleChange} className="form-select" required>
            <option value="">Pilih</option>
            <option value="1">Normal</option>
            <option value="2">Di atas normal</option>
            <option value="3">Jauh di atas normal</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Level Glukosa</label>
          <select name="glucose" value={input.glucose} onChange={handleChange} className="form-select" required>
            <option value="">Pilih</option>
            <option value="1">Normal</option>
            <option value="2">Di atas normal</option>
            <option value="3">Jauh di atas normal</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Merokok</label>
          <select name="smoking" value={input.smoking} onChange={handleChange} className="form-select" required>
            <option value="">Pilih</option>
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Konsumsi Alkohol</label>
          <select name="alcohol" value={input.alcohol} onChange={handleChange} className="form-select" required>
            <option value="">Pilih</option>
            <option value="1">Ya</option>
            <option value="0">Tidak</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Aktivitas Fisik</label>
          <select name="activity" value={input.activity} onChange={handleChange} className="form-select" required>
            <option value="">Pilih</option>
            <option value="1">Aktif</option>
            <option value="0">Tidak aktif</option>
          </select>
        </div>
      </div>
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      
      <div className="text-center mt-4">
        <button type="submit" className="btn btn-primary btn-lg px-5" disabled={loading}>
          {loading ? 'Memproses...' : 'Prediksi'}
        </button>
      </div>
    </form>
  );
}

export default PredictionForm;
