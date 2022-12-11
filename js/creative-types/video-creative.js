import Creative from '../creative.js'
import { firebaseApp } from '/js/firebase.js'
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js'
import getImagesFromVideo from '/js/utils/getImagesFromVideo.js'

const storage = getStorage(firebaseApp)

class VideoCreative extends Creative {
	// constructor() {
	// 	super()
	// }

	async getDownloadURL(index = 0) {
		return getDownloadURL(ref(storage, this.files[index]))
	}

	async getDimensions() {
		return new Promise((resolve, reject) => {
			let video = document.createElement('video')
			video.src = window.URL.createObjectURL(this.files[0])
			video.addEventListener('loadeddata', () => {
				this.width = video.videoWidth
				this.height = video.videoHeight
				resolve()
				window.URL.revokeObjectURL(video.src)
			})
			resolve(super.getDimensions())
			video.load()
		})
	}

	async generateFallback() {
		const blobs = await getImagesFromVideo(this.files[0])

		const ext = this.name.split('.').pop()
		this.fallback = this.files[0].name.replace('.' + ext, `_${blobs.length - 1}.png`)
		this.files.push(...blobs)
	}

	static get extensions() {
		return ['mp4']
	}

	get HTMLTag() {
		return 'video'
	}

	asHTML() {
		const element = document.createElement(this.HTMLTag)
		// element.src = this.path
		this.getDownloadURL(1).then((url) => {
			element.poster = url
		})
		element.style.aspectRatio = this.width / this.height
		return element
	}
}

VideoCreative.extensions.forEach((extension) => {
	Creative.extensions[extension] = VideoCreative
})
