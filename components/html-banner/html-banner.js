const template = document.createElement('template'),
	observerSettings = {
		rootMargin: '-50vh 0px',
		threshold: 0.1,
	},
	observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) entry.target.becomesVisible()
			else entry.target.becomesInvisible()
		}, observerSettings)
	})

template.innerHTML = `
	<style>
    @import '/components/html-banner/html-banner.css'
	</style>
	<iframe></iframe>
`

class BannerPreview extends HTMLElement {
	constructor() {
		super()

		this.attachShadow({ mode: 'open' })
		this.shadowRoot.appendChild(template.content.cloneNode(true))

		this.iframe = this.shadowRoot.querySelector('iframe')
		// this.iframe.loading = 'lazy'

		this.becomesVisible = () => {
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

		this.becomesInvisible = () => {
			// this.shadowRoot.querySelector('iframe').style.background = 'red'
			this.iframe.src = ''
		}

		observer.observe(this)
	}

	connectedCallback() {
		this.onUpdate()
	}

	static get observedAttributes() {
		return ['src']
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.onUpdate()
		this.iframe.src = this.getAttribute('src')
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
	}
	//
	//   render() {
	//     this.h3
	//   }
}

window.customElements.define('html-banner', BannerPreview)
