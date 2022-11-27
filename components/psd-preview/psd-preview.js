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
				@import '/components/psd-preview/psd-preview.css'
			</style>
			<!--svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 240 234"><path fill="#001e36" d="M42.5 0h155C221 0 240 19 240 42.5v149c0 23.5-19 42.5-42.5 42.5h-155C19 234 0 215 0 191.5v-149C0 19 19 0 42.5 0z"/><path fill="#31a8ff" d="M54 164.1V61.2c0-.7.3-1.1 1-1.1l5.6-.1 7.6-.2 8.7-.2 9.1-.1c8.2 0 15 1 20.6 3.1 5 1.7 9.6 4.5 13.4 8.2 3.2 3.2 5.7 7.1 7.3 11.4 1.5 4.2 2.3 8.5 2.3 13 0 8.6-2 15.7-6 21.3-4 5.6-9.6 9.8-16.1 12.2a64.8 64.8 0 0 1-22.5 3.4l-5-.1-4.3-.1V164c.1.7-.4 1.3-1.1 1.4H55.2c-.8 0-1.2-.4-1.2-1.3zm21.8-84.7V113l3.9.2H85c3.9 0 7.8-.6 11.5-1.8 3.2-.9 6-2.8 8.2-5.3 2.1-2.5 3.1-5.9 3.1-10.3a14.5 14.5 0 0 0-9.3-14.6 29.3 29.3 0 0 0-11.8-2l-6.8.1c-2-.1-3.4 0-4.1.1zM192 106.9a52.7 52.7 0 0 0-20.8-4.7c-2-.1-4.1.2-6 .7-1.3.3-2.4 1-3.1 2-.5.8-.8 1.8-.8 2.7 0 .9.4 1.8 1 2.6.9 1.1 2.1 2 3.4 2.7 2.3 1.2 4.7 2.3 7.1 3.3a72.4 72.4 0 0 1 15.4 7.3c3.3 2.1 6 4.9 7.9 8.3 1.6 3.2 2.4 6.7 2.3 10.3a23.3 23.3 0 0 1-15.1 22.2 45.8 45.8 0 0 1-18.1 3.2c-4.6 0-9.1-.4-13.6-1.3-3.5-.6-7-1.7-10.2-3.2-.7-.4-1.2-1.1-1.1-1.9v-17.4c0-.3.1-.7.4-.9.3-.2.6-.1.9.1 3.9 2.3 8 3.9 12.4 4.9 3.8 1 7.8 1.5 11.8 1.5a19 19 0 0 0 8.3-1.4 4.6 4.6 0 0 0 2.7-4.2c0-1.4-.8-2.7-2.4-4a42.4 42.4 0 0 0-9.8-4.7 61.2 61.2 0 0 1-14.2-7.2 21.5 21.5 0 0 1-9.9-18.7 23.5 23.5 0 0 1 13.9-21.3 38.8 38.8 0 0 1 17.7-3.5c4.1 0 8.3.3 12.4.9 3 .4 5.9 1.2 8.6 2.3.4.1.8.5 1 .9l.2 1.2v16.3c0 .4-.2.8-.5 1-.9.2-1.4.2-1.8 0z"/></svg-->
			<img src="/fs/${this.creative.fallback}"/>
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
