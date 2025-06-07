import React from 'react';

function PredictionResult({ result }) {
  if (!result) return null;

  console.log('Result in PredictionResult:', result); // Debug log
  
  const isHighRisk = result.risk === 'high';
  const colorClass = isHighRisk ? 'danger' : 'success';
  const riskText = isHighRisk ? 'Risiko Tinggi' : 'Risiko Rendah';
  const percentage = typeof result.percentage === 'number' ? 
    result.percentage.toFixed(1) : 
    (result.probability * 100).toFixed(1);

  return (
    <div className={`mt-4 rounded-4 shadow-lg p-4 border border-${colorClass}`}>
      <h2 className="text-center fs-4 mb-4">Hasil Prediksi</h2>
      
      <div className="text-center">
        <div className={`display-6 text-${colorClass} mb-3`}>
          {riskText}
        </div>
        
        <div className="fs-4 mb-3">
          <span className="text-secondary">Probabilitas: </span>
          <strong className={`text-${colorClass}`}>{percentage}%</strong>
        </div>

        {result.riskFactors && result.riskFactors.length > 0 && (
          <div className="mt-4 text-start">
            <h3 className="fs-5 mb-3">Faktor Risiko Terdeteksi:</h3>
            <ul className="list-unstyled">
              {result.riskFactors.map((factor, idx) => (
                <li key={idx} className="mb-2">
                  <i className="fa-solid fa-triangle-exclamation text-warning me-2"></i>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center small text-muted">
        <i className="fa-solid fa-info-circle me-1"></i>
        Hasil ini hanya prediksi. Silakan konsultasikan dengan dokter untuk diagnosis yang akurat.
      </div>
    </div>
  );
}

export default PredictionResult;
