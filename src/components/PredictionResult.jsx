import React from 'react';
import { motion } from 'framer-motion';

function PredictionResult({ result }) {
  const isHighRisk = result?.prediction === 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`card border-0 shadow-sm ${isHighRisk ? 'bg-danger-subtle' : 'bg-success-subtle'}`}>
        <div className="card-body p-4 text-center">
          <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
               style={{ 
                 width: 80, 
                 height: 80, 
                 backgroundColor: isHighRisk ? '#dc3545' : '#198754',
                 border: '2px solid white'
               }}>
            <i className={`fa-solid ${isHighRisk ? 'fa-triangle-exclamation' : 'fa-heart'} fs-1 text-white`}></i>
          </div>
          <h3 className={`mb-3 ${isHighRisk ? 'text-danger' : 'text-success'}`}>
            {isHighRisk ? 'Risiko Tinggi' : 'Risiko Rendah'}
          </h3>
          <p className="mb-0">
            Berdasarkan data yang Anda masukkan, sistem kami memprediksi bahwa Anda memiliki
            <strong className={isHighRisk ? 'text-danger' : 'text-success'}>
              {' '}{isHighRisk ? 'risiko tinggi' : 'risiko rendah'}{' '}
            </strong>
            terkena penyakit kardiovaskular.
          </p>
          {isHighRisk && (
            <div className="alert alert-danger mt-3 mb-0">
              <i className="fa-solid fa-hospital me-2"></i>
              Segera konsultasikan kondisi Anda dengan dokter!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default PredictionResult;
