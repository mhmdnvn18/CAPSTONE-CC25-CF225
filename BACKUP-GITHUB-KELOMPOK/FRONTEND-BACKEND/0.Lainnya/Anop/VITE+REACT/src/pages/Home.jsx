import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import { fetchSupabaseData } from '../services/api';
function Home() {
  const [result, setResult] = useState(null);

  // React.useEffect(() => {
  //   fetchSupabaseData().then(console.log).catch(console.error);
  // }, []);

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light px-2">
      <header className="w-100" style={{ maxWidth: 700 }}>
        <div className="d-flex align-items-center gap-3 mb-2 mt-4">
          <span className="d-flex align-items-center justify-content-center rounded-circle shadow bg-primary-subtle" style={{ width: 48, height: 48 }}>
            <i className="fa-solid fa-heart-pulse fs-2 text-danger"></i>
          </span>
          <span className="fs-3 fw-bold text-primary">CardioPredict</span>
        </div>
        <h1 className="fw-bold fs-2 text-primary text-center mb-2 d-flex align-items-center justify-content-center gap-2">
          <i className="fa-solid fa-stethoscope text-primary"></i>
          Deteksi Dini Penyakit Kardiovaskular
        </h1>
        <p className="text-secondary text-center mb-2">
          Prediksi risiko penyakit kardiovaskular Anda secara cepat dan mudah. Data Anda aman dan hanya digunakan untuk prediksi.
        </p>
      </header>
      <main className="w-100" style={{ maxWidth: 700 }}>
        <div className="w-100">
          <PredictionForm onResult={setResult} />
        </div>
        {result && (
          <div className="w-100">
            <PredictionResult result={result} />
          </div>
        )}
        <div className="mt-4 w-100 mx-auto" style={{ maxWidth: 500 }}>
          <div className="bg-info-subtle border border-info rounded-3 p-3 small text-secondary text-center">
            <span className="fw-semibold text-primary">Disclaimer:</span> Hasil prediksi ini bersifat estimasi dan tidak menggantikan diagnosis dokter. Konsultasikan hasil ke tenaga medis profesional.
          </div>
        </div>
      </main>
      <footer className="mt-5 mb-3 text-muted small text-center w-100">
        &copy; {new Date().getFullYear()} Capstone Coding Camp &mdash; CardioPredict
      </footer>
    </div>
  );
}

export default Home;
