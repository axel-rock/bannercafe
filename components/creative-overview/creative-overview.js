import '/components/html-banner/html-banner.js'
import '/components/default-preview/default-preview.js'
import '/components/psd-preview/psd-preview.js'
import Creative from '/js/creative.js'

export class CreativeOverview extends HTMLElement {
	connectedCallback() {
		// #todo Set Active Attribute
		if (!this.creative) return
	}

	static get observedAttributes() {
		return ['src']
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
			<a href="/details/?name=${this.creative.name}">
				<span class="type">${this.creative.type}</span>
				<span>${this.creative.name}</span>
				<span class="size">${Creative.humanFileSize(this.creative.size)}</span>
			</a>
			`

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
				break
			case 'psd':
				this.preview = document.createElement('psd-preview')
				break
			default:
				this.preview = document.createElement('default-preview')
				break
		}

		this.preview.creative = this.creative
		this.preview.classList.add('preview')
		this.querySelector('a').appendChild(this.preview)

		if (this.getAttribute('src')) this.preview.src = this.getAttribute('src')

		this.addEventListener('mousedown', (e) => {
			this.preview.style.pointerEvents = 'none'
		})

		this.addEventListener('mouseup', (e) => {
			this.preview.style.pointerEvents = 'auto'
		})
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
