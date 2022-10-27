import {SearchBar} from '../search-bar.js'

export class SiteHeader extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
		<style>
			@import '/components/site-header/site-header.css'
		</style>
		<header>
			<h1><a href="/"><img src="/img/bannercafe.png"/></a></h1>
			<search-bar></search-bar>
			<div>
				<a href="/gallery/">Gallery</a>
				<!--<a href="#">Log in</a>-->
			</div>
		</header>
		`

		this.querySelectorAll('a').forEach(anchor => {
			if (anchor.pathname.split('/')[1] === window.location.pathname.split('/')[1])
				anchor.classList.add('active')
		})
	}
}

window.customElements.define('site-header', SiteHeader)