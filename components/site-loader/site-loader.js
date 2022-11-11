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

	show() {
		this.querySelector('dialog').showModal()
	}

	hide() {
		this.querySelector('dialog').close()
	}

	static show() {
		document.querySelector('site-loader').show()
	}

	static hide() {
		document.querySelector('site-loader').hide()
	}
}

window.customElements.define('site-loader', SiteLoader)
