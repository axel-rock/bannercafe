var PSD = require('psd')

export class PSDPreview extends HTMLElement {
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

		this.innerHTML = `
			<style>
				@import '/_components/psd-preview/psd-preview.css'
			</style>
			`

		// PSD.fromURL('/fs/' + this.creative.files[0]).then((psd) => {
		// 	console.log(psd)
		// 	// const preview = psd.image.toPng()
		// 	// this.appendChild(preview)
		// })
	}

	get src() {
		this.getAttribute('src')
	}

	set src(value) {
		this.setAttribute('src', value.replace('.psd', '.png'))
	}

	static readPSD(path) {
		return PSD.fromURL(path)
	}
}

window.customElements.define('psd-preview', PSDPreview)
