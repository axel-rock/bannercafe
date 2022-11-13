export class BannercafeLogo extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<style>
			@import '/components/bannercafe-logo/bannercafe-logo.css'
		</style>
		<h1>Bannercafe</h1>
		`
	}
}

window.customElements.define('bannercafe-logo', BannercafeLogo)
