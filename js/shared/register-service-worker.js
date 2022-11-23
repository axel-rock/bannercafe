if (!('serviceWorker' in navigator)) {
	console.warn('unable to initialize nohost service worker: not supported.')
} else {
	navigator.serviceWorker
		.register('/nohost-sw.js') // see configuration options below
		.catch((err) => {
			console.error(`unable to register nohost service worker: ${err.message}`)
		})
}
