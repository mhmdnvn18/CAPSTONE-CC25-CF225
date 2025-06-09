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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-heart-pulse text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">IllDetect</h1>
                <p className="text-xs text-gray-500">Cardiovascular Risk Detector</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === '/'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <i className="fas fa-home mr-2"></i>
                Beranda
              </Link>
              <Link
                to="/prediction"
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === '/prediction'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <i className="fas fa-heart-pulse mr-2"></i>
                Prediksi
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-red-600">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-heart-pulse text-white"></i>
                </div>
                <span className="text-xl font-bold">IllDetect</span>
              </div>
              <p className="text-gray-400 text-sm max-w-md">
                Solusi prediksi risiko penyakit kardiovaskular berbasis web untuk mendeteksi dini potensi masalah jantung dengan teknologi AI.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Menu</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white transition">Beranda</Link></li>
                <li><Link to="/prediction" className="text-gray-400 hover:text-white transition">Prediksi Risiko</Link></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition">Kontak</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Hubungi Kami</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p><i className="fas fa-envelope mr-2"></i> info@illdetect.com</p>
                <p><i className="fas fa-phone mr-2"></i> +62 xxx-xxxx-xxxx</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <i className="fab fa-github text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 IllDetect. Capstone Coding Camp - CC25 & CF225. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;