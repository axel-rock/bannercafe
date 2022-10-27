import '/components/html-banner/html-banner.js'
import Creative from '/js/creative.js'

export class CreativeOverview extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		// #todo Set Active Attribute
	}

	static get observedAttributes() {
		return ['src']
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.onUpdate()
	}

	onUpdate() {
		const src = this.getAttribute('src')
		if (!src)
			return
		const dimensions = src.match(/\d+x\d+/)[0]

		let width = this.width = +dimensions.split('x')[0]
		let height = this.height = +dimensions.split('x')[1]

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
		this.preview = document.createElement('html-banner')

		this.querySelector('a').appendChild(this.preview)

		if (this.getAttribute('src'))
			this.preview.src = this.getAttribute('src')

		this.addEventListener('mousedown', e => {
			this.preview.style.pointerEvents = 'none'
		})

		this.addEventListener('mouseup', e => {
			this.preview.style.pointerEvents = 'auto'
		})
	}

	get src() {
		this.getAttribute('src')
	}

	set src(value) {
		this.setAttribute('src', value)
	}

// 	get creative() {
// 		return this.creative
// 	}
//
// 	set creative(value) {
// 		this.creative = value
// 	}
}

window.customElements.define('creative-overview', CreativeOverview)