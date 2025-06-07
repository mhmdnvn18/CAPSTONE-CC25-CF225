import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Custom hook for network status
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleNetworkChange = (event) => {
      setIsOnline(event.detail.online);
    };

    window.addEventListener('networkStatusChange', handleNetworkChange);

    return () => {
      window.removeEventListener('networkStatusChange', handleNetworkChange);
    };
  }, []);

  return isOnline;
}

// Custom hook for standalone mode detection
function useStandaloneMode() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                        window.navigator.standalone === true;
      setIsStandalone(standalone);
    };

    checkStandalone();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addListener(checkStandalone);

    return () => {
      mediaQuery.removeListener(checkStandalone);
    };
  }, []);

  return isStandalone;
}

// Custom hook for PWA installation
function useInstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const isStandalone = useStandaloneMode();

  useEffect(() => {
    if (isStandalone) {
      setShowInstallButton(false);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setShowInstallButton(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      console.log('IllDetect app was installed');
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      // Clear the deferredPrompt variable
      setDeferredPrompt(null);
      // Hide the install button
      setShowInstallButton(false);
    }
  };

  return { showInstallButton, handleInstallClick, isStandalone };
}

function Layout({ children }) {
  const { showInstallButton, handleInstallClick, isStandalone } = useInstallPWA();
  const isOnline = useNetworkStatus();
  const location = useLocation();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-heart text-red-600 text-xl animate-pulse"></i>
                <div className="absolute inset-0 rounded-full border-2 border-red-600 opacity-0 animate-ping"></div>
              </div>
            </div>
            <Link to="/" className="text-red-600 font-bold text-xl md:text-2xl hover:text-red-700 transition">
              IllDetect - Cardiovascular Diagnosis Detector
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  location.pathname === '/' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Beranda
              </Link>
              <Link
                to="/prediction"
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  location.pathname === '/prediction' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Prediksi
              </Link>
            </nav>
            
            {/* Network Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Install Button */}
            {showInstallButton && (
              <button 
                onClick={handleInstallClick}
                className="bg-red-600 text-white py-2 px-4 rounded-full text-sm flex items-center hover:bg-red-700 transition"
              >
                <i className="fas fa-download mr-2"></i> Install App
              </button>
            )}
            
            {/* Standalone Mode Indicator */}
            {isStandalone && (
              <div className="bg-green-100 text-green-700 py-1 px-2 rounded-full text-xs">
                <i className="fas fa-mobile-alt mr-1"></i> Installed
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4">
          <i className="fas fa-wifi mr-2"></i>
          Anda sedang offline. Beberapa fitur mungkin terbatas.
        </div>
      )}

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-heart text-white"></i>
                </div>
                <span className="text-xl font-bold">IllDetect - Cardiovascular Diagnosis Detector</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm max-w-md">
                Solusi prediksi risiko penyakit kardiovaskular berbasis web untuk mendeteksi dini potensi masalah jantung.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400 text-center">
            <p>&copy; {new Date().getFullYear()} Capstone Coding Camp &mdash; IllDetect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout; 