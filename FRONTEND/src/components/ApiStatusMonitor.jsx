import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cardiovascularAPI from '../services/api';

const ApiStatusMonitor = () => {
  const [status, setStatus] = useState({
    connected: false,
    message: 'Checking connection...',
    lastChecked: null,
    responseTime: null
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const startTime = Date.now();
      const result = await cardiovascularAPI.checkHealth();
      const endTime = Date.now();
      
      setStatus({
        connected: result.success,
        message: result.message || (result.success ? 'Backend connected' : 'Backend unavailable'),
        lastChecked: new Date(),
        responseTime: endTime - startTime
      });
    };

    // Initial check
    checkStatus();

    // Set up periodic checks
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (status.connected) return 'green';
    return 'red';
  };

  const getStatusIcon = () => {
    if (status.connected) return 'fa-check-circle';
    return 'fa-exclamation-triangle';
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border p-3 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ 
              scale: status.connected ? [1, 1.2, 1] : 1,
              opacity: status.connected ? [1, 0.7, 1] : 1
            }}
            transition={{ 
              duration: status.connected ? 2 : 0,
              repeat: status.connected ? Infinity : 0
            }}
          >
            <i className={`fas ${getStatusIcon()} text-${getStatusColor()}-600`}></i>
          </motion.div>
          
          <div>
            <span className={`text-sm font-medium text-${getStatusColor()}-700`}>
              {status.connected ? 'Backend Connected' : 'Offline Mode'}
            </span>
            {status.responseTime && (
              <span className="text-xs text-gray-500 ml-2">
                ({status.responseTime}ms)
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'}`}></i>
        </button>
      </div>
      
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600"
          >
            <div className="space-y-1">
              <p>Status: {status.message}</p>
              {status.lastChecked && (
                <p>Last checked: {status.lastChecked.toLocaleTimeString()}</p>
              )}
              <p className="text-blue-600">
                <i className="fas fa-info-circle mr-1"></i>
                {status.connected 
                  ? 'Using backend AI for predictions' 
                  : 'Using local prediction algorithms'
                }
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ApiStatusMonitor;
