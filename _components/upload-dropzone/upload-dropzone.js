import { SiteLoader } from '../site-loader/site-loader.js'
import Campaign from '/js/campaign.js'
import Creative from '/js/creative.js'
let template

export class UploadDropzone extends HTMLElement {
	static get observedAttributes() {
		return ['campaign']
	}

	// attributeChangedCallback(name, oldValue, newValue) {
	// 	this.onUpdate()
	// }

	async connectedCallback() {
		if (!template) {
			template = await fetch('/_components/upload-dropzone/upload-dropzone.html')
			template = await template.text()
		}
		this.innerHTML = template

		this.addEventListeners()
	}

	// onUpdate() {}

	async onDrop(event) {
		event.preventDefault()
		SiteLoader.show('Collecting files')
		this.hideDropzone()

		try {
			let creatives = await Creative.getCreativesFromEntries(
				[...event.dataTransfer.items].map((item) => item.webkitGetAsEntry())
			)

			SiteLoader.show('Generate metadata')
			await Promise.all(
				creatives.map(async (creative) => {
					await creative.getSyncMetadata()
					return creative.upload(this.getAttribute('campaign'))
				})
			)
		} catch (e) {
			console.error(e)
			SiteLoader.hide()
		}

		setTimeout(() => {
			SiteLoader.hide()
		}, 1000)
	}

	showDropzone() {
		this.classList.add('active')
	}

	hideDropzone() {
		this.classList.remove('active')
	}

	get campaign() {
		this.getAttribute('campaign')
	}

	set campaign(value) {
		this.setAttribute('campaign', value)
	}

	addEventListeners() {
		let lastTarget = null
		window.addEventListener('dragenter', (e) => {
			lastTarget = e.target
			console.log(e.dataTransfer, e.dataTransfer.types, e.dataTransfer.items)
			if (e.dataTransfer.types.includes('Files')) this.showDropzone()
			// this.style.opacity = 1
		})
		window.addEventListener('dragleave', (e) => {
			if (e.target === lastTarget) this.hideDropzone()
		})

		this.addEventListener('dragover', (event) => event.preventDefault())
		this.addEventListener('dragenter', (event) => event.preventDefault())
		this.addEventListener('dragleave', (event) => event.preventDefault())
		this.addEventListener('drop', this.onDrop)
	}
}

window.customElements.define('upload-dropzone', UploadDropzone)
