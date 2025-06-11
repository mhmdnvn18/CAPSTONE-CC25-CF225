import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('networkStatusChange', {
        detail: { online: true }
      }));
      
      // Hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('networkStatusChange', {
        detail: { online: false }
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
            isOnline 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <i className={`fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'}`}></i>
            <span className="font-medium">
              {isOnline ? 'Back Online' : 'You are Offline'}
            </span>
          </div>
          <p className="text-sm opacity-90 mt-1">
            {isOnline 
              ? 'Full features are now available' 
              : 'Limited features available in offline mode'
            }
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;
