import React, { useState, useEffect } from 'react';
import CardiovascularAPI from '../services/api';

function ApiStatusMonitor() {
  const [status, setStatus] = useState('checking');
  const [connectionInfo, setConnectionInfo] = useState(null);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkApiStatus = async () => {
    try {
      setStatus('checking');
      const health = await CardiovascularAPI.checkHealth();
      setStatus('connected');
      setConnectionInfo(health);
      setLastCheck(new Date());
    } catch (error) {
      setStatus('disconnected');
      setConnectionInfo({ error: error.message });
      setLastCheck(new Date());
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'green';
      case 'disconnected': return 'red';
      case 'checking': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return 'fas fa-check-circle';
      case 'disconnected': return 'fas fa-times-circle';
      case 'checking': return 'fas fa-spinner fa-spin';
      default: return 'fas fa-question-circle';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Backend Terhubung';
      case 'disconnected': return 'Backend Terputus';
      case 'checking': return 'Memeriksa Koneksi...';
      default: return 'Status Tidak Diketahui';
    }
  };

  return (
    <div className={`p-3 rounded-lg border-l-4 ${
      status === 'connected' ? 'bg-green-50 border-green-500' :
      status === 'disconnected' ? 'bg-red-50 border-red-500' :
      'bg-yellow-50 border-yellow-500'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i className={`${getStatusIcon()} text-${getStatusColor()}-600`}></i>
          <div>
            <h4 className={`font-medium text-${getStatusColor()}-800`}>
              {getStatusText()}
            </h4>
            {connectionInfo && (
              <p className={`text-sm text-${getStatusColor()}-700`}>
                {status === 'connected' ? (
                  <>
                    Database: {connectionInfo.supabase} | 
                    Uptime: {Math.floor(connectionInfo.uptime)}s
                  </>
                ) : (
                  `Error: ${connectionInfo.error}`
                )}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {lastCheck && (
            <span className={`text-xs text-${getStatusColor()}-600`}>
              {lastCheck.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={checkApiStatus}
            className={`p-1 rounded hover:bg-${getStatusColor()}-100 transition`}
            title="Refresh status"
          >
            <i className="fas fa-refresh text-sm"></i>
          </button>
        </div>
      </div>
      
      {status === 'disconnected' && (
        <div className="mt-2 text-sm text-red-700">
          <p>⚠️ Menggunakan prediksi lokal. Pastikan backend server berjalan di port 5001.</p>
        </div>
      )}
    </div>
  );
}

export default ApiStatusMonitor;
