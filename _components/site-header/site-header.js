import { SearchBar } from '../search-bar/search-bar.js'

export class SiteHeader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<style>
			/* @import '/_components/site-header/site-header.css' */
		</style>
		<header>
			<h1>
				<a href="/">
				<svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 531.83 531.59"><path id="shield" d="M46.7,460,.17.41H512L465.47,460,255.52,512Z" transform="translate(9.83 9.59)" fill="none" stroke="#000" stroke-linejoin="round" stroke-width="20"/><path id="cup" d="M390,181.41c0,23.92-54.47,43.31-121.66,43.31s-121.66-19.39-121.66-43.31,54.47-43.32,121.66-43.32S390,157.48,390,181.41Zm-243.32,0v43.31c0,70.25,54.47,127.19,121.66,127.19S390,295,390,224.72V181.41M146.68,220S90,197.07,90,243.16s86.91,65.47,86.91,65.47" transform="translate(9.83 9.59)" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="20"/></svg>
				</a>
			</h1>
			<!--search-bar></search-bar-->

			<!--a href="/sign-up/">Pricing</a-->
			<span style="flex-grow:1"></span>
			<a href="/dashboard/" class="admin-only">Dashboard</a>
			<profile-button class="admin-only"></profile-button>
		</header>
		`

		this.querySelectorAll('a').forEach((anchor) => {
			if (anchor.pathname.split('/')[1] === window.location.pathname.split('/')[1]) anchor.classList.add('active')
		})
	}
}

window.customElements.define('site-header', SiteHeader)
