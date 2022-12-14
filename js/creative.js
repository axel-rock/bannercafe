import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	collection,
	doc,
	setDoc,
	serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
import { getStorage, ref, uploadBytes, getBytes } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js'
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js'
import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
import Campaign from '/js/campaign.js'
const Filer = window.Filer

const fs = new Filer.FileSystem().promises
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)
const analytics = getAnalytics()

export default class Creative {
	constructor({
		versionId,
		creativeId,
		name,
		files,
		type,
		width,
		height,
		campaign,
		size,
		fallback,
		tags,
		user,
		timestamp,
	}) {
		this.versionId = versionId
		this.creativeId = creativeId
		this.name = name
		this.files = files
		this.type = type
		this.width = width
		this.height = height
		this.campaign = campaign
		this.size = size || this.files.map((file) => file.size).reduce((a, b) => a + b, 0)
		if (fallback) this.fallback = fallback
		this.tags = tags || []
		this.user = user
		this.timestamp = timestamp
	}

	/**
	 * Get and set metadata asynchronous
	 */
	async getSyncMetadata() {
		return Promise.all([this.generateFallback(), this.getDimensions()])
	}

	async generateFallback() {
		console.warn('generateFallback must be defined for each type')
		this.fallback ??= `https://place-hold.it/${this.width}x${this.height}`
	}

	/**
	 * Get and set dimensions, parsed from file name
	 */
	getDimensions() {
		const parsedDimensions = this.name.match(/\d+x\d+/)
			? this.name
					.match(/\d+x\d+/)[0]
					.split('x')
					.map((x) => parseInt(x))
			: [0, 0]
		this.width ??= parsedDimensions[0]
		this.height ??= parsedDimensions[1]
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
		this.creativeId = Creative.hashCode(this.name)
		const creativeRef = doc(db, Campaign.COLLECTION, campaign, Creative.COLLECTION, this.creativeId)
		const versionRef = doc(
			collection(db, Campaign.COLLECTION, campaign, Creative.COLLECTION, this.creativeId, Creative.VERSION_COLLECTION)
		)

		this.versionId = versionRef.id

		const uploadSnapshots = await Promise.all(
			this.files.map((file) => {
				const storageRef = ref(storage, ['uploads', Campaign.COLLECTION, campaign, this.versionId, file.name].join('/'))
				return uploadBytes(storageRef, file)
			})
		)

		// Update file paths
		this.files = uploadSnapshots.map((snapshot) => snapshot.ref.fullPath)

		if (this.fallback && !this.fallback.includes('/')) {
			const found = this.files.find((file) => file.endsWith(this.fallback))
			console.log(found)
			this.fallback = found
		}

		// Add date field
		this.timestamp = serverTimestamp()

		// Add infos about who uploaded
		this.user = await get('user')

		// Update firestore
		const { ...creative } = this
		return await Promise.all([setDoc(creativeRef, creative, { merge: true }), setDoc(versionRef, creative)])
	}

	async storeLocally(files = this.files) {
		return Promise.all(
			files.map(async (file) => {
				if (typeof file === 'object') {
					return new Promise(async (resolve, reject) => {
						const reader = new FileReader()
						try {
							await fs.mkdir('/' + this.name)
						} catch (e) {
							reject(e)
						}
						reader.onload = (e) => {
							resolve(fs.writeFile('/' + [this.name, file.name].join('/'), Filer.Buffer.from(reader.result)))
						}
						reader.readAsArrayBuffer(file)
					}).catch((e) => {
						return
					})
				}

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

	/**
	 * Get the name of the firebase collection for Creatives
	 * @type {String}
	 */
	static get VERSION_COLLECTION() {
		return 'versions'
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
		const classForFileType = Creative.extensions[object.type] || Creative
		return new classForFileType(object)
	}

	asHTML() {
		const element = document.createElement(this.HTMLTag)
		element.src = this.path
		element.width = this.width
		element.height = this.height
		return element
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

	static extensions = {}

	/**
	 * Returns a hash code from a string
	 * @param  {String} str The string to hash.
	 * @return {Number}    A 32bit integer
	 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
	 */
	static hashCode(input) {
		var output = ''
		for (var i = 0; i < input.length; i++) {
			if (input.charCodeAt(i) <= 127) {
				output += input.charAt(i)
			} else {
				output += '&#' + input.charCodeAt(i) + ';'
			}
		}
		return output.replaceAll('__.*__', '').replaceAll('/', '_')
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

window.customElements.define('creative-element', Creative)
