export class DefaultPreview extends HTMLElement {
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
				@import '/components/default-preview/default-preview.css'
			</style>
			<span>${src.split('.').pop()}</span>
			`

		this.style.width = this.creative.width + 'px'
		this.style.height = this.creative.height + 'px'
	}

	get src() {
		this.getAttribute('src')
	}

	set src(value) {
		this.setAttribute('src', value)
	}
}

window.customElements.define('default-preview', DefaultPreview)
