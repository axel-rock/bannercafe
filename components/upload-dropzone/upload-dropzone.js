import { SiteLoader } from '../site-loader/site-loader.js'
import Campaign from '/js/campaign.js'
import Creative from '/js/creative.js'
let template

export class UploadDropzone extends HTMLElement {
	static get observedAttributes() {
		return ['campaign']
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.onUpdate()
	}

	async connectedCallback() {
		if (!template) {
			template = await fetch('/components/upload-dropzone/upload-dropzone.html')
			template = await template.text()
		}
		this.innerHTML = template

		this.addEventListeners()
	}

	onUpdate() {}

	async onDrop(event) {
		event.preventDefault()
		SiteLoader.show('Collecting files')
		this.hideDropzone()

		let creatives = await Creative.getCreativesFromEntries(
			[...event.dataTransfer.items].map((item) => item.webkitGetAsEntry())
		)

		console.log(creatives)
		SiteLoader.show('Generate metadata')

		await Promise.all(
			creatives.map(async (creative) => {
				await creative.getSyncMetadata()
				return creative.upload(this.getAttribute('campaign'))
			})
		)

		setTimeout(() => {
			SiteLoader.hide()
		}, 1000)
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
			this.classList.add('active')
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
