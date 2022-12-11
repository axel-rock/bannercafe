import Creative from '../creative.js'

export default class HTMLCreative extends Creative {
	// constructor() {
	// 	super()
	// }

	async generateFallback() {
		const fallbackInBanner = this.files.find((file) => file.name.split('.')[0] == this.name)
		if (fallbackInBanner) {
			this.fallback = fallbackInBanner.name
		}
	}

	static get extensions() {
		return ['html']
	}

	get HTMLTag() {
		return 'iframe'
	}
}

HTMLCreative.extensions.forEach((extension) => {
	Creative.extensions[extension] = HTMLCreative
})
