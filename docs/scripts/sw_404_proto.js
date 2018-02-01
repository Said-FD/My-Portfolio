self.addEventListener('fetch', function(event) {
	event.respondWith(
		fetch(event.request).then(function(response) {
			if(response.status === 404) {
				// return new Response('Something for 404 response goes here');
// OR
				// return fetch('/images/some-image OR url');
			}
			return response;
		}).catch(function() {
			return new Response('Crush message goes here');
		})
	);
});
