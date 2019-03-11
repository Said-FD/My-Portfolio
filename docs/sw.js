var cacheName = 'v0.4';
var cacheFiles = [
	'./',
	'./index.html',
	'./404.html',
	'./manifest.json',
	'./humans.txt',
	'./scripts/script.min.js',
	// './scripts/offline-google-analytics-import.js',
	'./images/bg-2.jpg',
	'./images/icons/sprite.png',
	'./images/icons/envelope-white-50.png',
	'./images/projects/travel-test_lg-hi.jpg',
	'./images/projects/work_lg-hi.jpg',
	'./images/projects/cs_lg-hi.jpg',
	'./images/projects/parallax_lg-hi.jpg',
	'./images/projects/form_lg-hi.jpg',
	'./images/projects/mogo-test_lg-hi.jpg',
	'./images/projects/travel-test_lg.jpg',
	'./images/projects/work_lg.jpg',
	'./images/projects/cs_lg.jpg',
	'./images/projects/parallax_lg.jpg',
	'./images/projects/form_lg.jpg',
	'./images/projects/mogo-test_lg.jpg',
	'./images/projects/travel-test_md.jpg',
	'./images/projects/work_md.jpg',
	'./images/projects/cs_md.jpg',
	'./images/projects/parallax_md.jpg',
	'./images/projects/form_md.jpg',
	'./images/projects/mogo-test_md.jpg',
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
