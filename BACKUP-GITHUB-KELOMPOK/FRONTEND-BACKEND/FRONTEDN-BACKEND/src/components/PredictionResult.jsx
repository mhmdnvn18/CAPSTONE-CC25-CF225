import React from 'react';

function PredictionResult({ result }) {
  if (!result) return null;

  const { percentage, level, color, bmi, formData } = result;
  
  // Determine colors and classes based on risk level
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          border: 'border-green-500',
          bg: 'bg-green-100',
          text: 'text-green-500',
          progressBar: 'bg-green-500'
        };
      case 'yellow':
        return {
          border: 'border-yellow-500',
          bg: 'bg-yellow-100',
          text: 'text-yellow-500',
          progressBar: 'bg-yellow-500'
        };
      default: // red
        return {
          border: 'border-red-500',
          bg: 'bg-red-100',
          text: 'text-red-500',
          progressBar: 'bg-red-500'
        };
    }
  };

  const colors = getColorClasses();
  const genderText = formData.gender === 1 ? 'perempuan' : 'laki-laki';
  
  // Build BMI alert message
  const bmiAlert = parseFloat(bmi) > 25 ? 
    '<br><small class="text-orange-600 font-medium">⚠️ BMI Anda menunjukkan kelebihan berat badan</small>' : '';
  
  // Build smoking alert message  
  const smokingAlert = formData.smoke === 1 ? 
    '<br><small class="text-red-600 font-medium">🚭 Merokok meningkatkan risiko kardiovaskular</small>' : '';

  return (
    <div className={`border-4 ${colors.border} rounded-xl p-6 mb-6 text-center`}>
      <div className={`mx-auto w-24 h-24 ${colors.bg} rounded-full flex items-center justify-center mb-4`}>
        <i className={`fas fa-heart-pulse ${colors.text} text-4xl animate-pulse`}></i>
      </div>
      
      {/* Risk Level and Percentage in same row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-4">
        <h4 className={`text-2xl font-bold ${colors.text}`}>
          RISIKO {level.toUpperCase()}
        </h4>
        <div className={`text-2xl font-bold ${colors.text}`}>
          {percentage}%
        </div>
      </div>
      
      {/* Progress Bar Indicator */}
      <div className="max-w-xs mx-auto bg-gray-100 rounded-full h-4 mb-6">
        <div 
          className={`${colors.progressBar} h-4 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {/* BMI and Age Stats */}
      <div className="bg-gray-50 rounded-lg p-3 mx-auto max-w-md mb-4">
        <p className="text-base text-gray-600 text-center">
          BMI: <span className="font-medium">{bmi}</span> | Usia: <span className="font-medium">{formData.age} tahun</span>
        </p>
      </div>
      
      <div className="text-gray-700 mb-4">
        <p>
          Berdasarkan analisis data ({genderText}, {formData.age} tahun), Anda memiliki{' '}
          <span className="font-semibold">risiko {level.toLowerCase()}</span> terkena penyakit kardiovaskular.
        </p>
        
        {/* BMI Alert */}
        {parseFloat(bmi) > 25 && (
          <p className="text-orange-600 font-medium text-sm mt-2">
            ⚠️ BMI Anda menunjukkan kelebihan berat badan
          </p>
        )}
        
        {/* Smoking Alert */}
        {formData.smoke === 1 && (
          <p className="text-red-600 font-medium text-sm mt-2">
            🚭 Merokok meningkatkan risiko kardiovaskular
          </p>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
        <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-lightbulb text-blue-500 mr-2"></i>
          Rekomendasi
        </h4>
        
        <ul className="space-y-3">
          <li className="flex">
            <div className="flex-shrink-0 mt-1">
              <i className="fas fa-check-circle text-blue-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-gray-700">
                {level === 'Tinggi' 
                  ? 'Segera konsultasikan ke dokter spesialis jantung untuk pemeriksaan lebih lanjut'
                  : 'Pertahankan gaya hidup sehat dan lakukan pemeriksaan rutin'
                }
              </p>
            </div>
          </li>
          <li className="flex">
            <div className="flex-shrink-0 mt-1">
              <i className="fas fa-check-circle text-blue-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-gray-700">Mulai pola makan sehat rendah lemak dan rendah garam</p>
            </div>
          </li>
          <li className="flex">
            <div className="flex-shrink-0 mt-1">
              <i className="fas fa-check-circle text-blue-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-gray-700">Lakukan aktivitas fisik ringan secara rutin minimal 30 menit per hari</p>
            </div>
          </li>
          <li className="flex">
            <div className="flex-shrink-0 mt-1">
              <i className="fas fa-check-circle text-blue-500"></i>
            </div>
            <div className="ml-3">
              <p className="text-gray-700">Hindari merokok dan batasi konsumsi alkohol</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PredictionResult;
