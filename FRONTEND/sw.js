// ...existing code...

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    // Skip non-http(s) requests like chrome-extension://
    if (!(event.request.url.indexOf('http') === 0)) return;

    // In development, always fetch from network first
    const isDevelopment = event.request.url.includes('localhost') || event.request.url.includes('127.0.0.1');
    
    if (isDevelopment) {
        return;
    }

    // Production behavior - cache first
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) return response;
                
                console.log('Service Worker: Fetching from network', event.request.url);
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
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        return response;
                    }
                ).catch(() => {
                    // Return offline page for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// ...existing code...