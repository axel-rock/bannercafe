export class SiteLoader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<style>
				@import '/components/site-loader/site-loader.css'
			</style>
			<dialog>
				Loading
			</dialog>
		`
	}

	show(text = 'Loading') {
		this.querySelector('dialog').textContent = text
		if (!this.querySelector('dialog').open) this.querySelector('dialog').showModal()
	}

	hide() {
		this.querySelector('dialog').close()
	}

	static show(text) {
		document.querySelector('site-loader').show(text)
	}

	static hide() {
		document.querySelector('site-loader').hide()
	}
}

window.customElements.define('site-loader', SiteLoader)
