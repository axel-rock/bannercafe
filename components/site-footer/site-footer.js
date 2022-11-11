export class SiteFooter extends HTMLElement {
// 	constructor() {
// 		super()
//
// 		this.attachShadow({mode: 'open'})
// 		this.shadowRoot.appendChild(template.content.cloneNode(true))
//
// 		this.innerHTML = template.content.cloneNode(true)
// 	}

	connectedCallback() {
		// #todo Set Active Attribute
		this.innerHTML = `
		<style>
			@import '/components/site-footer/site-footer.css'
		</style>
		<footer>
			<a href="/gallery/">Gallery</a>
			<a href="/specs/">Specifications</a>
			<!--
			<a href="/details/">Details</a>
			<a href="/side-by-side/">Side by side</a>
			<a href="/roadmap/">Roadmap</a>
			-->
			<label for="theme-selector">Theme:</label>
			<select id="theme-selector" name="theme-selector" class="save-preference">
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="default" selected>System</option>
			</select>
		</footer>
		`

		const themeSelector = this.querySelector('#theme-selector')
		themeSelector.onchange = e => {
			console.log(themeSelector.value)
		}

		this.querySelectorAll('a').forEach(anchor => {
			if (anchor.pathname.split('/')[1] === window.location.pathname.split('/')[1])
				anchor.classList.add('active')
		})
	}
}

window.customElements.define('site-footer', SiteFooter)