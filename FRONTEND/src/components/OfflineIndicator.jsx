import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineToast(true);
      setTimeout(() => setShowOnlineToast(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show offline toast if already offline
    if (!navigator.onLine) {
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 5000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Persistent Offline Status Bar */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-0 left-0 right-0 bg-amber-600 text-white py-2 px-4 text-center text-sm z-50 shadow-md"
          >
            <div className="flex items-center justify-center space-x-2">
              <motion.i 
                className="fas fa-wifi-slash"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.i>
              <span>Mode Offline Aktif - Fitur terbatas tersedia</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Toast Notification */}
      <AnimatePresence>
        {showOfflineToast && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-4 right-4 bg-amber-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <i className="fas fa-wifi-slash text-xl mt-1"></i>
              <div>
                <h4 className="font-semibold mb-1">Koneksi Terputus</h4>
                <p className="text-sm opacity-90">
                  Anda sedang offline. IllDetect tetap dapat digunakan dengan fitur prediksi lokal.
                </p>
              </div>
              <button
                onClick={() => setShowOfflineToast(false)}
                className="text-white hover:text-gray-200 ml-2"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Toast Notification */}
      <AnimatePresence>
        {showOnlineToast && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <i className="fas fa-wifi text-xl mt-1"></i>
              <div>
                <h4 className="font-semibold mb-1">Kembali Online</h4>
                <p className="text-sm opacity-90">
                  Koneksi internet tersedia. Semua fitur sekarang dapat digunakan.
                </p>
              </div>
              <button
                onClick={() => setShowOnlineToast(false)}
                className="text-white hover:text-gray-200 ml-2"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfflineIndicator;
