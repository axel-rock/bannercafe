const template = document.createElement('template')

template.innerHTML = `
	<style>
    @import '/components/html-banner/html-banner.css'
	</style>
	<img/>
	<iframe></iframe>
`

class BannerPreview extends HTMLElement {
	constructor() {
		super()

		this.attachShadow({ mode: 'open' })
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.iframe = this.shadowRoot.querySelector('iframe')
		this.fallback = this.shadowRoot.querySelector('img')
		// this.iframe.loading = 'lazy'
	}

	async showIFrame() {
		await this.creative.storeLocally()
		this.iframe.src = this.getAttribute('src')

		// Trying to cancel console logs
		let iframeWindow = this.iframe.contentWindow
		iframeWindow.console.log = function () {
			/* nop */
		}
		iframeWindow.console.error = function () {
			/* nop */
		}

		//       setTimeout(() => {
		//         console.log(iframeWindow.clickTag)
		//         iframeWindow.gsap.globalTimeline.pause()
		//       }, 1000)
		//
		//       setTimeout(() => {
		//         iframeWindow.gsap.globalTimeline.resume()
		//       }, 2000)
	}

	connectedCallback() {
		this.onUpdate()
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
		const dimensions = this.creative?.dimensions || src.match(/\d+x\d+/)[0]

		let width = (this.width = +dimensions.split('x')[0])
		let height = (this.height = +dimensions.split('x')[1])

		this.iframe.width = this.width
		this.iframe.height = this.height

		// this.iframe.style.background = 'red'

		// this.render()
	}

	get src() {
		this.getAttribute('src')
	}

	set src(value) {
		this.setAttribute('src', value)
		this.showIFrame()
	}
}

window.customElements.define('html-banner', BannerPreview)
