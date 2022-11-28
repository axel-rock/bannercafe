import '/components/html-banner/html-banner.js'
import '/components/default-preview/default-preview.js'
import '/components/psd-preview/psd-preview.js'
import Creative from '/js/creative.js'

const loadFallbackObserver = new IntersectionObserver(
	(entries, loadFallbackObserver) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.becomesVisible()
				loadFallbackObserver.unobserve(entry.target)
			}
		})
	},
	{ threshold: 0 }
)

const fullyInViewObserver = new IntersectionObserver(
	(entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.becomesFullyVisible()
			} else {
				entry.target.becomesInvisible()
			}
		})
	},
	{ threshold: 1 }
)

export class CreativeOverview extends HTMLElement {
	connectedCallback() {
		// #todo Set Active Attribute
		if (!this.creative) return
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.onUpdate()
	}

	onUpdate() {
		const src = this.getAttribute('src')
		if (!src) return
		this.creative.dimensions ??= src.match(/\d+x\d+/)[0]
		this.creative.width ??= this.width = +dimensions.split('x')[0]
		this.creative.height ??= this.height = +dimensions.split('x')[1]

		//todo: creative class

		this.innerHTML = `
			<style>
				@import '/components/creative-overview/creative-overview.css'
			</style>
			<a href="/creative/?creativeId=${this.creative.creativeId}&versionId=${this.creative.versionId}&campaign=${
			this.creative.campaign
		}">
				<span class="type">${this.creative.type}</span>
				<span>${this.creative.name}</span>
				<span class="size">${Creative.humanFileSize(this.creative.size)}</span>
				<img class="fallback preview" src=""/>
			</a>
			`

		this.fallback = this.querySelector('.fallback')

		switch (this.creative.type) {
			case 'html':
				this.preview = document.createElement('html-banner')
				this.preview.classList.add('fallback')
				break
			case 'jpg':
			case 'png':
				this.preview = document.createElement('img')
				break
			case 'mp4':
				this.preview = document.createElement('video')
				this.preview.controls = true
				this.preview.preload = 'metadata'
				break
			// case 'psd':
			// 	this.preview = document.createElement('psd-preview')
			// 	break
			default:
				this.preview = document.createElement('default-preview')
				break
		}

		if (this.preview) {
			this.preview.creative = this.creative
			this.preview.classList.add('preview')
			this.querySelector('a').appendChild(this.preview)
		}

		// if (this.getAttribute('src')) this.preview.src = this.getAttribute('src')

		this.addEventListener('mousedown', (e) => {
			this.preview.style.pointerEvents = 'none'
		})

		this.addEventListener('mouseup', (e) => {
			this.preview.style.pointerEvents = 'auto'
		})
	}

	startObserver() {
		loadFallbackObserver.observe(this)
		fullyInViewObserver.observe(this)
	}

	async becomesVisible() {
		await this.creative.loadFallback()
		this.fallback.src = (this.creative.fallback.startsWith('http') ? '' : '/fs/') + this.creative.fallback
		if (this.preview.tagName === 'VIDEO') this.becomesFullyVisible()
	}

	async becomesFullyVisible() {
		if (this.creative.getDownloadURL) {
			this.preview.src = await this.creative.getDownloadURL()
		} else if (this.preview) this.preview.src = this.creative.path
	}

	becomesInvisible() {
		if (this.preview && this.preview.tagName !== 'VIDEO') this.preview.removeAttribute('src')
	}

	static get observedAttributes() {
		return ['src']
	}

	get width() {
		return this.creative.width
	}

	get height() {
		return this.creative.height
	}

	get src() {
		this.getAttribute('src')
	}

	set src(value) {
		this.setAttribute('src', value)
	}
}

window.customElements.define('creative-overview', CreativeOverview)
