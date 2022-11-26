import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	collection,
	doc,
	setDoc,
	serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
import { getStorage, ref, uploadBytes, getBytes } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js'
import { get } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
import Campaign from '/js/campaign.js'
const Filer = window.Filer
const fs = new Filer.FileSystem().promises
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export default class Creative {
	constructor({ name, type, width, height, files, campaign, size, fallback, tags, user, timestamp }) {
		this.name = name
		this.type = type
		this.width = width || this.getDimensions()[0]
		this.height = height || this.getDimensions()[1]
		this.files = files
		this.campaign = campaign
		this.size = size || this.files.map((file) => file.size).reduce((a, b) => a + b, 0)
		this.fallback = fallback || `https://place-hold.it/${this.width}x${this.height}`
		this.tags = tags || []
		this.user = user
		this.timestamp = timestamp
	}

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
		console.log(['uploads', Campaign.COLLECTION, campaign, docRef.id].join('/'))

		const uploadSnapshots = await Promise.all(
			this.files.map((file) => {
				const storageRef = ref(storage, ['uploads', Campaign.COLLECTION, campaign, docRef.id, file.name].join('/'))
				return uploadBytes(storageRef, file)
			})
		)

		// Update file paths
		this.files = uploadSnapshots.map((snapshot) => snapshot.ref.fullPath)
		// Add date field

		this.timestamp = serverTimestamp()

		this.user = await get('user')

		const { ...creative } = this
		// Update firestore

		console.log(creative)

		return await setDoc(docRef, creative)
	}

	async storeLocally() {
		await Promise.all(
			this.files.map((file) => {
				const dirs = file.split('/')
				dirs.forEach(async (dir, index) => {
					try {
						await fs.mkdir('/' + dirs.slice(0, index).join('/'))
					} catch (e) {
						// console.error(e)
					}
				})

				return getBytes(ref(storage, file)).then((bytes) => fs.writeFile('/' + file, Filer.Buffer.from(bytes)))
			})
		)

		// try {
		// 	await fs.mkdir('/test')
		// 	await fs.mkdir(campaignId)
		// } catch (e) {
		// 	console.error(e)
		// }
	}

	/**
	 * Get the name of the firebase collection for Creatives
	 * @type {String}
	 */
	static get COLLECTION() {
		return 'creatives'
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
		return new Creative({
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
		return new Creative({
			name: entry.name,
			type: entry.name.split('.').pop(),
			files: [await Creative.#entryToFile(entry)],
		})
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
