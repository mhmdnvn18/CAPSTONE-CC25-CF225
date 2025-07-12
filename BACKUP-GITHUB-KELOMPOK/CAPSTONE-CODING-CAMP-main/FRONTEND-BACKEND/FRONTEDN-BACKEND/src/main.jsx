import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Tailwind Configuration
if (typeof window !== 'undefined' && window.tailwind) {
  window.tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: '#dc2626',
          secondary: '#ff9900',
          dark: '#1e293b'
        },
        animation: {
          'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
          'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        },
        keyframes: {
          heartbeat: {
            '0%, 100%': { transform: 'scale(1)' },
            '30%': { transform: 'scale(1.1)' },
            '50%': { transform: 'scale(0.9)' },
            '70%': { transform: 'scale(1.05)' }
          }
        }
      }
    }
  };
}

// Enhanced PWA Functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // Clear cache in development when page loads
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              console.log('Development: Clearing cache', cacheName);
              return caches.delete(cacheName);
            })
          );
        });
      }
    }, error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

// Network status detection (global)
function updateNetworkStatus() {
  if (navigator.onLine) {
    console.log('Online');
    // Dispatch custom event for React components
    window.dispatchEvent(new CustomEvent('networkStatusChange', { detail: { online: true } }));
  } else {
    console.log('Offline');
    // Dispatch custom event for React components
    window.dispatchEvent(new CustomEvent('networkStatusChange', { detail: { online: false } }));
  }
}

// Listen for network changes
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// Initialize network status
updateNetworkStatus();

// Check if app is running in standalone mode (installed)
function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

// Update UI based on install status
document.addEventListener('DOMContentLoaded', function() {
  if (isRunningStandalone()) {
    console.log('IllDetect app is running in standalone mode');
    document.body.classList.add('standalone-mode');
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
