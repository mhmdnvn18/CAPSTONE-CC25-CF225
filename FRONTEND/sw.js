const CACHE_NAME = 'illdetect-v1.0.0';
const STATIC_CACHE = 'illdetect-static-v1.0.0';
const API_CACHE = 'illdetect-api-v1.0.0';

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then((cache) => {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/manifest.json',
                    '/icon/hati.svg'
                ]);
            }),
            // Clear old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ]).then(() => {
            console.log('Service Worker: Installed successfully');
            return self.skipWaiting();
        })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        self.clients.claim().then(() => {
            console.log('Service Worker: Activated successfully');
        })
    );
});

// Message event - handle scroll restoration
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SCROLL_TO_TOP') {
        // Send message to all clients to scroll to top
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'FORCE_SCROLL_TOP'
                });
            });
        });
    }
});

// Helper function to handle API requests with CORS
async function handleApiRequest(request) {
    try {
        // For API requests, try network first
        const response = await fetch(request, {
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            // Cache successful API responses
            const cache = await caches.open(API_CACHE);
            cache.put(request, response.clone());
            return response;
        }
        
        throw new Error(`API request failed: ${response.status}`);
    } catch (error) {
        console.log('Service Worker: API request failed, trying cache...', error);
        
        // Try to get from cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('Service Worker: Serving from cache');
            return cachedResponse;
        }
        
        // Return offline response for API requests
        return new Response(JSON.stringify({
            success: false,
            message: 'Offline mode active',
            source: 'service-worker-fallback'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

// Helper function to check if request is for API
function isApiRequest(url) {
    return url.includes('/api/') || url.includes('backend-api-cgkk.onrender.com');
}

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    
    // Skip non-http(s) requests like chrome-extension://
    if (!(event.request.url.indexOf('http') === 0)) return;

    // In development, handle CORS issues differently
    const isDevelopment = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1';
    
    if (isDevelopment && event.request.method === 'GET') {
        // For development, just fetch normally
        return;
    }

    // Handle API requests specially
    if (isApiRequest(event.request.url)) {
        event.respondWith(handleApiRequest(event.request));
        return;
    }

    // Handle static assets and pages
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }
                
                // Fetch from network
                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Only cache same-origin requests to avoid CORS issues
                        if (event.request.url.startsWith(self.location.origin)) {
                            caches.open(STATIC_CACHE)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        return response;
                    }
                ).catch((error) => {
                    console.log('Service Worker: Fetch failed:', error);
                    
                    // Return offline page for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html').then(response => {
                            // Ensure scroll to top for cached pages
                            if (response) {
                                self.clients.matchAll().then(clients => {
                                    clients.forEach(client => {
                                        client.postMessage({
                                            type: 'FORCE_SCROLL_TOP'
                                        });
                                    });
                                });
                            }
                            return response || new Response('Offline', { status: 503 });
                        });
                    }
                    
                    // For other requests, return a generic offline response
                    return new Response('Service Unavailable', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

// Handle background sync for offline predictions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync-predictions') {
        event.waitUntil(syncPredictions());
    }
});

// Sync predictions when back online
async function syncPredictions() {
    try {
        const cache = await caches.open(API_CACHE);
        const requests = await cache.keys();
        
        for (const request of requests) {
            if (request.url.includes('/api/predict')) {
                // Re-validate prediction data when back online
                try {
                    await fetch(request);
                } catch (error) {
                    console.log('Service Worker: Could not sync prediction:', error);
                }
            }
        }
    } catch (error) {
        console.log('Service Worker: Background sync failed:', error);
    }
}