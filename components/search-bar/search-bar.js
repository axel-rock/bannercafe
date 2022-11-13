export class SearchBar extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<style>
				@import '/css/search-bar.css'
			</style>
			<input type="search" placeholder="Search" minlength="3">
			<svg aria-hidden="true" class="svg-icon s-input-icon s-input-icon__search iconSearch" width="18" height="18" viewBox="0 0 18 18"><path d="M18 16.5l-5.14-5.18h-.35a7 7 0 1 0-1.19 1.19v.35L16.5 18l1.5-1.5zM12 7A5 5 0 1 1 2 7a5 5 0 0 1 10 0z"></path></svg>
			<dialog id="search-results">
				<button id="close">Close</button>
				Results here
			</dialog>
		`

		const input = this.querySelector('input')
		const results = this.querySelector('#search-results')
		const close = this.querySelector('#close')

		input.onsearch = () => {
			results.showModal()
		}

		close.onclick = () => {
			results.close()
		}
	}
}

window.customElements.define('search-bar', SearchBar)