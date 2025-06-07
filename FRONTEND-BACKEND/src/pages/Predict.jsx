import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';

function Predict() {
  const [result, setResult] = useState(null);
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
                CardioRisk!
              </a>
              <small className="text-white-50 ms-2">Detect Your Risk. Protect Your Heart</small>
            </div>
            <button 
              className="btn text-white"
              onClick={() => navigate('/')}
            >
              <i className="fa-solid fa-arrow-left me-2"></i>
              Kembali ke Home
            </button>
          </div>
        </nav>

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="text-center mb-4" style={{ color: '#2C3E50' }}>
                Form Diagnosis Kardiovaskular
              </h2>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <PredictionForm onResult={setResult} />
                </div>
              </div>

              {result && (
                <div className="mt-4">
                  <PredictionResult result={result} />
                </div>
              )}

              <div className="mt-4 bg-warning-subtle border border-warning rounded-3 p-3">
                <p className="small text-center mb-0">
                  <span className="fw-bold">Disclaimer:</span> Hasil prediksi ini bersifat estimasi dan tidak menggantikan diagnosis dokter. 
                  Konsultasikan hasil ke tenaga medis profesional.
                </p>
              </div>
            </div>
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

export default Predict;