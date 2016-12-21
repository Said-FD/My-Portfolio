var cacheName = 'v6';
var cacheFiles = [
	'./',
	'./index.html',
	'./manifest.json',
	'./scripts/script.min.js',
	// './scripts/offline-google-analytics-import.js',
	'./humans.txt',
	'./404.html',
	'./images/bg_1.jpg',
	'./images/icons/sprite.png',
	'./images/icons/envelope-white-50.png',
	'./images/projects/travel-agency--large-hi-dpi.jpg',
	'./images/projects/work-agency--large-hi-dpi.jpg',
	'./images/projects/security-service--large-hi-dpi.jpg',
	'./images/projects/test-landing--large-hi-dpi.jpg',
	'./images/projects/animated-form--large-hi-dpi.jpg',
	'./images/projects/animated-carousel--large-hi-dpi.jpg',
	'./images/projects/travel-agency--large.jpg',
	'./images/projects/work-agency--large.jpg',
	'./images/projects/security-service--large.jpg',
	'./images/projects/test-landing--large.jpg',
	'./images/projects/animated-form--large.jpg',
	'./images/projects/animated-carousel--large.jpg',
	'./images/projects/travel-agency--medium-hi-dpi.jpg',
	'./images/projects/work-agency--medium-hi-dpi.jpg',
	'./images/projects/security-service--medium-hi-dpi.jpg',
	'./images/projects/test-landing--medium-hi-dpi.jpg',
	'./images/projects/animated-form--medium-hi-dpi.jpg',
	'./images/projects/animated-carousel--medium-hi-dpi.jpg',
	'./images/projects/travel-agency--medium.jpg',
	'./images/projects/work-agency--medium.jpg',
	'./images/projects/security-service--medium.jpg',
	'./images/projects/test-landing--medium.jpg',
	'./images/projects/animated-form--medium.jpg',
	'./images/projects/animated-carousel--medium.jpg',
	'./images/marvin_the_paranoid_android.png'
];

self.addEventListener('install', function(e) {
	console.log('[Service Worker] Installed');
	
	e.waitUntil(
		caches.open(cacheName)
		.then(function(cache) {
			console.log('[Service Worker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
		})
	);
});

self.addEventListener('activate', function(e) {
	console.log('[Service Worker] Activated');

	e.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(cacheNames.map(function(thisCacheName) {
				if(thisCacheName !== cacheName) {
					console.log('[Service Worker] Removing Cached Files from Cache -', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	);
});

// importScripts('scripts/offline-google-analytics-import.js');
// goog.offlineGoogleAnalytics.initialize();

self.addEventListener('fetch', function(e) {
	console.log('[Service Worker] Fetching', e.request.url);

	e.respondWith(
		caches.match(e.request)
		.catch(function() {
			return fetch(e.request);
		})
		.then(function(response) {
			if(response) {
				console.log('[Service Worker] Found in cache', e.request.url);
				return response;
			}
			
			var requestClone = e.request.clone();
			
			fetch(requestClone)
			.then(function(response) {
				if (!response) {
					console.log('[Service Worker] No response from fetch');
					return response;
				}

				var responseClone = e.response.clone();

				caches.open(cacheName)
				.then(function(cache) {
					cache.put(e.request, responseClone);
					console.log('[Service Worker] New Data Cached', e.request.url);
					return response;
				})
				.catch(function() {
					return caches.match(cacheFiles);
				});
			})
			.catch(function(error) {
				console.log('[Service Worker] Error Fetching and Caching New Data', error);
			});
		})
	);
});
