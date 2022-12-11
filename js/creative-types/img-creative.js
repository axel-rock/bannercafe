import Creative from '../creative.js'

class ImgCreative extends Creative {
	// constructor() {
	// 	super()
	// }

	async generateFallback() {
		this.fallback = this.files[0].name
	}

	get HTMLTag() {
		return 'img'
	}

	static get extensions() {
		return ['jpg', 'png', 'jpeg']
	}
}

ImgCreative.extensions.forEach((extension) => {
	Creative.extensions[extension] = ImgCreative
})
