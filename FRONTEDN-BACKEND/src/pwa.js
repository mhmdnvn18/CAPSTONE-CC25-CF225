// PWA (Progressive Web App) Functionality

// Service Worker Registration
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

// PWA Installation
const installButton = document.getElementById('installButton');
let deferredPrompt;

// Hide install button by default
if (installButton) {
    installButton.style.display = 'none';
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    if (installButton) {
        installButton.style.display = 'flex';
    }
});

// Handle install button click
if (installButton) {
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // Clear the deferredPrompt variable
            deferredPrompt = null;
            // Hide the install button
            installButton.style.display = 'none';
        }
    });
}

// Listen for the appinstalled event
window.addEventListener('appinstalled', (evt) => {
    console.log('CardioPredict app was installed');
    // Hide the install button
    if (installButton) {
        installButton.style.display = 'none';
    }
});

// Check if app is running in standalone mode (installed)
function isRunningStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
}

// Update UI based on install status
document.addEventListener('DOMContentLoaded', function() {
    if (isRunningStandalone()) {
        console.log('App is running in standalone mode');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }
});

// Network status detection
function updateNetworkStatus() {
    const statusElement = document.getElementById('networkStatus');
    if (navigator.onLine) {
        console.log('Online');
        if (statusElement) {
            statusElement.textContent = 'Online';
            statusElement.className = 'text-green-500';
        }
    } else {
        console.log('Offline');
        if (statusElement) {
            statusElement.textContent = 'Offline';
            statusElement.className = 'text-red-500';
        }
    }
}

// Listen for network changes
window.addEventListener('online', updateNetworkStatus);
window.addEventListener('offline', updateNetworkStatus);

// Initialize network status
updateNetworkStatus(); 