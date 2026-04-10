const CACHE_NAME = 'qsen-v5'
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.svg'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version:', CACHE_NAME)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets')
        return cache.addAll(urlsToCache).catch(err => {
          console.error('[SW] Cache addAll failed:', err)
          // Don't fail installation if caching fails
          return Promise.resolve()
        })
      })
      .then(() => {
        console.log('[SW] Skip waiting')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version:', CACHE_NAME)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('[SW] Existing caches:', cacheNames)
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('[SW] Claiming clients')
      return self.clients.claim()
    })
  )
})

// Fetch event - Network first, fallback to cache for better updates
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip API requests from cache
  if (event.request.url.includes('/api/')) {
    return
  }

  // For HTML files, always try network first
  if (event.request.url.endsWith('.html') || event.request.url.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the new version
          if (response && response.status === 200) {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request)
        })
    )
    return
  }

  // For other resources, cache first for performance
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }

        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch((error) => {
          console.error('[SW] Fetch failed:', error)
          throw error
        })
      })
  )
})
