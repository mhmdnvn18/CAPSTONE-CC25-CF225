import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Define navigation items with improved icons
  const navItems = [
    { path: '/', icon: 'fa-house-chimney', label: 'Beranda' },
    { path: '/prediction', icon: 'fa-heart-circle-check', label: 'Prediksi' },
    { path: '/about', icon: 'fa-circle-info', label: 'Tentang Kami' },
    { path: '/contact', icon: 'fa-paper-plane', label: 'Kontak' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Connection Status Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-500 text-white py-2 px-4 text-center text-sm"
          >
            <i className="fas fa-wifi-slash mr-2"></i>
            Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-md"
              >
                <i className="fas fa-heartbeat text-white text-xl"></i>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">IllDetect</h1>
                <p className="text-xs text-gray-500">Cardiovascular Risk Detector</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <motion.div key={item.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <i className={`fas ${item.icon} mr-2`}></i>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <motion.button 
              className="md:hidden p-2 text-gray-600 hover:text-red-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-2">
                  {navItems.map((item) => (
                    <motion.div 
                      key={item.path}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={item.path}
                        className={`block py-2 px-4 rounded-lg ${
                          location.pathname === item.path
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <i className={`fas ${item.icon} mr-2`}></i>
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer with improved icons */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <motion.div 
                className="flex items-center space-x-3 mb-4"
                whileHover={{ x: 5 }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center shadow-sm">
                  <i className="fas fa-heartbeat text-white"></i>
                </div>
                <span className="text-xl font-bold">IllDetect</span>
              </motion.div>
              <p className="text-gray-400 text-sm max-w-md">
                Solusi prediksi risiko penyakit kardiovaskular berbasis web untuk mendeteksi dini potensi masalah jantung dengan teknologi AI.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Menu</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white transition flex items-center"><i className="fas fa-angle-right mr-2 text-xs"></i>Beranda</Link></li>
                <li><Link to="/prediction" className="text-gray-400 hover:text-white transition flex items-center"><i className="fas fa-angle-right mr-2 text-xs"></i>Prediksi Risiko</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition flex items-center"><i className="fas fa-angle-right mr-2 text-xs"></i>Tentang Kami</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition flex items-center"><i className="fas fa-angle-right mr-2 text-xs"></i>Kontak</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Hubungi Kami</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p><i className="fas fa-envelope-open-text mr-2"></i> illdetect.team@gmail.com

</p>
                <p><i className="fas fa-headset mr-2"></i> +62 8123 4567 890</p>
                <div className="flex space-x-4 mt-4">
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <i className="fab fa-github text-xl"></i>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <i className="fab fa-twitter text-xl"></i>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 IllDetect. Capstone Coding Camp - CC25 & CF225. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;