import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	collection,
	doc,
	setDoc,
	serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
import {
	getStorage,
	ref,
	uploadBytes,
	getBytes,
	getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js'
import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
import Campaign from '/js/campaign.js'
const Filer = window.Filer
const fs = new Filer.FileSystem().promises
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

// Could not import PSD directly, this is a workaround for now
import { PSDPreview } from '/components/psd-preview/psd-preview.js'

export default class Creative {
	constructor({ id, name, type, width, height, files, campaign, size, fallback, tags, user, timestamp }) {
		this.id = id
		this.name = name
		this.type = type
		this.width = width || this.getDimensions()[0]
		this.height = height || this.getDimensions()[1]
		this.files = files
		this.campaign = campaign
		this.size = size || this.files.map((file) => file.size).reduce((a, b) => a + b, 0)
		if (fallback) this.fallback = fallback
		this.tags = tags || []
		this.user = user
		this.timestamp = timestamp

		set(this.id, this)
	}

	/**
	 * Get and set metadata asynchronous
	 */
	async getSyncMetadata() {
		await Promise.all([this.getFallback()])
		set(this.id, this)
		return this
	}

	async getFallback() {
		console.warn('getFallback must be defined for each type')
		this.fallback ??= `https://place-hold.it/${this.width}x${this.height}`
	}

	/**
	 * Get and set dimensions, parsed from file name
	 */
	getDimensions() {
		return this.name.match(/\d+x\d+/)
			? this.name
					.match(/\d+x\d+/)[0]
					.split('x')
					.map((x) => parseInt(x))
			: [0, 0]
	}

	/**
	 * Get a creative dimensions in px
	 * @type {String}  - Formatted as [width]x[height]. ie: '300x600'
	 */
	get dimensions() {
		return [this.width, this.height].join('x')
	}

	get path() {
		if (this.type === 'html') return '/fs/' + this.files.find((file) => file.includes('index.html'))
		return '/fs/' + this.files[0]
	}

	async upload(campaign) {
		this.campaign = campaign
		const docRef = doc(collection(db, Creative.COLLECTION))
		this.id = docRef.id

		const uploadSnapshots = await Promise.all(
			this.files.map((file) => {
				const storageRef = ref(storage, ['uploads', Campaign.COLLECTION, campaign, docRef.id, file.name].join('/'))
				return uploadBytes(storageRef, file)
			})
		)

		// Update file paths
		this.files = uploadSnapshots.map((snapshot) => snapshot.ref.fullPath)

		if (this.fallback && !this.fallback.includes('/')) {
			const found = this.files.find((file) => file.endsWith(this.fallback))
			console.log(this.files, this.fallback, found)
			this.fallback = found
		}

		// Add date field
		this.timestamp = serverTimestamp()

		// Add infos about who uploaded
		this.user = await get('user')

		// Update firestore
		const { ...creative } = this
		return await setDoc(docRef, creative)
	}

	async storeLocally(files = this.files) {
		return Promise.all(
			files.map(async (file) => {
				// Don't redownload files if they exist locally
				try {
					const exist = (await fs.stat('/' + file)).isFile()
					if (exist) {
						return true
					}
				} catch (e) {}
				const dirs = file.split('/')
				dirs.forEach(async (dir, index) => {
					try {
						await fs.mkdir('/' + dirs.slice(0, index).join('/'))
					} catch (e) {
						// console.error(e)
					}
				})

				console.log('Downloading', file)

				return getBytes(ref(storage, file)).then((bytes) => fs.writeFile('/' + file, Filer.Buffer.from(bytes)))
			})
		)
	}

	async loadFallback() {
		if (this.fallback) {
			if (this.fallback.startsWith('http')) return this.fall
			return this.storeLocally([this.fallback])
		}
	}

	/**
	 * Get the name of the firebase collection for Creatives
	 * @type {String}
	 */
	static get COLLECTION() {
		return 'creatives'
	}

	static get SUPPORTED_EXTENSIONS() {
		return {
			psd: PSDCreative,
			mp4: VideoCreative,
			jpg: ImgCreative,
			png: ImgCreative,
		}
	}

	/**
	 * Get all Creatives from a list of FileEntries (typically, upon drag and drop)
	 * @param {[FileSystemFileEntry]} entries - an array of FileSystemFileEntry, got from webkitGetAsEntry() from each item in event.dataTransfer.items
	 * @returns {Promise} - A promise that resolves in an array of Creatives
	 */
	static async getCreativesFromEntries(entries) {
		entries = entries.filter((entry) => entry.name !== '.DS_Store')
		if (entries.some((entry) => entry.name === 'index.html')) return Creative.fromEntries(entries)
		return (
			await Promise.all(
				entries.map((entry) => {
					if (entry.isDirectory)
						return new Promise((resolve) => {
							entry.createReader().readEntries((entries) => resolve(Creative.getCreativesFromEntries(entries)))
						})
					if (entry.isFile) return Creative.fromEntry(entry)
				})
			)
		).flat()
	}

	/**
	 * Create a Creative object from a list of entries. Typically a banner
	 * @param {[FileSystemFileEntry]} entries - an array of FileSystemFileEntry, got from webkitGetAsEntry() from each item in event.dataTransfer.items
	 * @returns {Promise} - a promise that resolves in a Creative object
	 */
	static async fromEntries(entries) {
		return new HTMLCreative({
			name: entries
				.find((entry) => entry.name === 'index.html')
				.fullPath.split('/')
				.at(-2), // Get folder name
			type: 'html',
			files: await Promise.all(entries.map((entry) => Creative.#entryToFile(entry))),
		})
	}

	/**
	 * Create a Creative object from a single of entry. This is a single file creative (image, video, PSD)
	 * @param {FileSystemFileEntry} entry - a FileSystemFileEntry, got from webkitGetAsEntry() from event.dataTransfer.items
	 * @returns {Promise} - a promise that resolves in a Creative object
	 */
	static async fromEntry(entry) {
		const extension = entry.name.split('.').pop()
		return Creative.fromObject({
			name: entry.name,
			type: extension,
			files: [await Creative.#entryToFile(entry)],
		})
	}

	static fromObject(object) {
		const classForFileType = Creative.SUPPORTED_EXTENSIONS[object.type] || Creative
		return new classForFileType(object)
	}

	/**
	 * Get a file from an entry, promise based
	 */
	static async #entryToFile(entry) {
		return new Promise((resolve) => {
			entry.file((file) => {
				resolve(file)
			})
		})
	}

	/**
	 * Format bytes as human-readable text.
	 *
	 * @param bytes Number of bytes.
	 * @param si True to use metric (SI) units, aka powers of 1000. False to use
	 *           binary (IEC), aka powers of 1024.
	 * @param dp Number of decimal places to display.
	 *
	 * @return Formatted string.
	 */
	static humanFileSize(bytes, si = true, dp = 1) {
		const thresh = si ? 1000 : 1024

		if (Math.abs(bytes) < thresh) {
			return bytes + ' B'
		}

		const units = si
			? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
			: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
		let u = -1
		const r = 10 ** dp

		do {
			bytes /= thresh
			++u
		} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

		return bytes.toFixed(dp) + ' ' + units[u]
	}
}

class HTMLCreative extends Creative {
	async getFallback() {
		const fallbackInBanner = this.files.find((file) => file.name.split('.')[0] == this.name)
		if (fallbackInBanner) {
			this.fallback = fallbackInBanner.name
		}
	}
}

class PSDCreative extends Creative {
	async getFallback() {
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
}

class VideoCreative extends Creative {
	async getDownloadURL() {
		return getDownloadURL(ref(storage, this.files[0]))
	}
}

class ImgCreative extends Creative {
	async getFallback() {
		console.log(this, this.files[0].name)
		this.fallback = this.files[0].name
	}
}
