import Creative from '../creative.js'
// Could not import PSD directly, this is a workaround for now
import { PSDPreview } from '/_components/psd-preview/psd-preview.js'

export default class PSDCreative extends Creative {
	// constructor() {
	// 	super()
	// }

	async generateFallback() {
		const buffer = await new Promise((resolve) => {
			const reader = new FileReader()
			reader.onload = (e) => {
				resolve(Filer.Buffer.from(reader.result))
			}
			reader.readAsArrayBuffer(this.files[0])
		})
		await fs.writeFile('/' + this.files[0].name, buffer)

		const psd = await PSDPreview.readPSD('/fs/' + this.files[0].name)

		const fallback = this.files[0].name.replace('.psd', '.png')

		// const file = new Blob([image.file.data], { type: 'image/png' })
		const file = await fetch(psd.image.toBase64()).then((res) => res.blob())
		file.name = fallback

		this.files.push(file)
		// Set dimensions from PSD if they didn't exist
		if (!this.width) this.width = psd.header.cols
		if (!this.height) this.height = psd.header.rows

		this.fallback = fallback
	}

	static get extensions() {
		return ['psd']
	}

	get HTMLTag() {
		return 'img'
	}

	asHTML() {
		const element = document.createElement(this.HTMLTag)
		element.src = this.path.replace('.psd', '.png')
		return element
	}
}

PSDCreative.extensions.forEach((extension) => {
	Creative.extensions[extension] = PSDCreative
})
