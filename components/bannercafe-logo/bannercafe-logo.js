export class BannercafeLogo extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<style>
			@import '/components/bannercafe-logo/bannercafe-logo.css'
		</style>
		<span>Banner</span><span>cafe</span>
		`
	}
}

window.customElements.define('bannercafe-logo', BannercafeLogo)