import { SearchBar } from '../search-bar/search-bar.js'
import { BannercafeLogo } from '../bannercafe-logo/bannercafe-logo.js'

export class SiteHeader extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<style>
			@import '/components/site-header/site-header.css'
		</style>
		<header>
			<h1><a href="/"><bannercafe-logo></bannercafe-logo></a></h1>
			<!--search-bar></search-bar-->
			<div>
				<a href="/dashboard/" class="admin-only">Dashboard</a>
				<a href="/gallery/" class="admin-only">Gallery</a>
				<profile-button class="admin-only"></profile-button>
			</div>
		</header>
		`

		this.querySelectorAll('a').forEach((anchor) => {
			if (anchor.pathname.split('/')[1] === window.location.pathname.split('/')[1]) anchor.classList.add('active')
		})
	}
}

window.customElements.define('site-header', SiteHeader)
