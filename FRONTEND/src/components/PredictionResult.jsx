import React from 'react';

function PredictionResult({ result }) {
  if (!result) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Tidak ada data hasil prediksi</p>
      </div>
    );
  }

  const { percentage, level, color, bmi, formData, apiData } = result;

  const colors = {
    red: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-500',
      progressBar: 'bg-red-500'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-500',
      progressBar: 'bg-green-500'
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-500',
      progressBar: 'bg-yellow-500'
    }
  };

  const currentColors = colors[color] || colors.red;
  const genderText = formData?.gender === 1 ? 'Perempuan' : 'Laki-laki';
  
  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <div className={`border-4 ${currentColors.border} rounded-xl p-6 text-center bg-white shadow-lg`}>
        <div className={`mx-auto w-24 h-24 ${currentColors.bg} rounded-full flex items-center justify-center mb-4`}>
          <i className={`fas fa-heart-pulse ${currentColors.text} text-4xl animate-pulse`}></i>
        </div>
        
        {/* Risk Level and Percentage */}
        <div className="mb-6">
          <h4 className={`text-3xl font-bold ${currentColors.text} mb-2`}>
            RISIKO {level.toUpperCase()}
          </h4>
          <div className={`text-4xl font-bold ${currentColors.text} mb-4`}>
            {percentage}%
          </div>
          
          {/* Progress Bar */}
          <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`${currentColors.progressBar} h-4 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Basic Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">BMI:</span>
              <span className="font-medium ml-2">{bmi}</span>
            </div>
            <div>
              <span className="text-gray-600">Usia:</span>
              <span className="font-medium ml-2">{formData?.age} tahun</span>
            </div>
            <div>
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium ml-2">{genderText}</span>
            </div>
            <div>
              <span className="text-gray-600">Sumber:</span>
              <span className="font-medium ml-2">{apiData?.source || 'Local'}</span>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="text-gray-700 mb-4">
          <p className="mb-2">
            Berdasarkan analisis data ({genderText}, {formData?.age} tahun), Anda memiliki{' '}
            <span className="font-semibold">risiko {level.toLowerCase()}</span> terkena penyakit kardiovaskular.
          </p>
          
          {/* Health Alerts */}
          {parseFloat(bmi) > 25 && (
            <p className="text-orange-600 font-medium text-sm mt-2 bg-orange-50 p-2 rounded">
              ⚠️ BMI Anda menunjukkan kelebihan berat badan yang dapat meningkatkan risiko
            </p>
          )}
          
          {formData?.smoke === 1 && (
            <p className="text-red-600 font-medium text-sm mt-2 bg-red-50 p-2 rounded">
              🚭 Merokok meningkatkan risiko kardiovaskular secara signifikan
            </p>
          )}
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Factors */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-exclamation-triangle text-orange-500 mr-2"></i>
            Faktor Risiko
          </h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Tekanan Darah:</span>
              <span className={formData?.ap_hi > 140 ? 'text-red-600 font-medium' : 'text-green-600'}>
                {formData?.ap_hi}/{formData?.ap_lo} mmHg
              </span>
            </div>
            <div className="flex justify-between">
              <span>Kolesterol:</span>
              <span className={formData?.cholesterol === 3 ? 'text-red-600 font-medium' : 
                             formData?.cholesterol === 2 ? 'text-orange-600 font-medium' : 'text-green-600'}>
                {formData?.cholesterol === 1 ? 'Normal' : 
                 formData?.cholesterol === 2 ? 'Tinggi' : 'Sangat Tinggi'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Glukosa:</span>
              <span className={formData?.gluc === 3 ? 'text-red-600 font-medium' : 
                             formData?.gluc === 2 ? 'text-orange-600 font-medium' : 'text-green-600'}>
                {formData?.gluc === 1 ? 'Normal' : 
                 formData?.gluc === 2 ? 'Tinggi' : 'Sangat Tinggi'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Merokok:</span>
              <span className={formData?.smoke === 1 ? 'text-red-600 font-medium' : 'text-green-600'}>
                {formData?.smoke === 1 ? 'Ya' : 'Tidak'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Aktivitas Fisik:</span>
              <span className={formData?.active === 1 ? 'text-green-600' : 'text-orange-600 font-medium'}>
                {formData?.active === 1 ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-lightbulb text-blue-500 mr-2"></i>
            Rekomendasi
          </h4>
          
          <ul className="space-y-3 text-sm">
            {level === 'Tinggi' ? (
              <>
                <li className="flex items-start">
                  <i className="fas fa-user-md text-red-500 mt-1 mr-2"></i>
                  <span>Segera konsultasi dengan dokter spesialis jantung</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-pills text-blue-500 mt-1 mr-2"></i>
                  <span>Lakukan pemeriksaan EKG dan echocardiography</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                  <span>Pertahankan gaya hidup sehat</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-calendar-check text-blue-500 mt-1 mr-2"></i>
                  <span>Lakukan check-up rutin tahunan</span>
                </li>
              </>
            )}
            <li className="flex items-start">
              <i className="fas fa-apple-alt text-green-500 mt-1 mr-2"></i>
              <span>Pola makan sehat rendah lemak dan garam</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-running text-purple-500 mt-1 mr-2"></i>
              <span>Olahraga teratur 30 menit/hari, 5x/minggu</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-ban text-red-500 mt-1 mr-2"></i>
              <span>Hindari merokok dan batasi alkohol</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <i className="fas fa-info-circle text-yellow-600 mt-1"></i>
          <div className="text-yellow-800 text-sm">
            <p className="font-medium mb-1">Penting:</p>
            <p>
              Hasil prediksi ini hanya estimasi berbasis AI dan tidak menggantikan diagnosis medis. 
              Silakan konsultasikan dengan dokter spesialis untuk evaluasi yang lebih komprehensif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PredictionResult;