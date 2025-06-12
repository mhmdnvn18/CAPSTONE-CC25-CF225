import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('✅ Service Worker registered successfully:', registration.scope);
      
      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 New service worker available');
            // Optionally show update notification to user
            if (confirm('Versi baru IllDetect tersedia. Refresh untuk menggunakan versi terbaru?')) {
              window.location.reload();
            }
          }
        });
      });
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  });
}

// Handle app install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('💡 App install prompt available');
});

// Export install function for use in components
window.installApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('📱 Install outcome:', outcome);
    deferredPrompt = null;
  }
};

// Add global utility functions
window.lockBodyScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
};

window.unlockBodyScroll = () => {
  document.body.style.overflow = '';
  document.body.classList.remove('modal-open');
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
