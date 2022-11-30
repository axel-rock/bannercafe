// https://github.com/humphd/nohost
const Filer = window.Filer
const fs = new Filer.FileSystem().promises
import { showDirectoryPicker } from 'https://cdn.jsdelivr.net/npm/file-system-access/lib/es2018.js'
import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
import { SiteLoader } from '/_components/components-library.js'

if (!('serviceWorker' in navigator)) {
	console.warn('unable to initialize nohost service worker: not supported.')
} else {
	navigator.serviceWorker
		.register('/nohost-sw.js') // see configuration options below
		.catch((err) => {
			console.error(`unable to register nohost service worker: ${err.message}`)
		})
		.then(() => {
			document.getElementById('browse').style.display = 'unset'
		})
}

// Local files
const gallery = document.querySelector('#gallery')
const browseInput = document.getElementById('browse')
const refreshInput = document.getElementById('refresh')

const previousDirHandle = await get('directory')
if (previousDirHandle) {
	refreshInput.style.display = 'unset'
	refreshInput.textContent = 'Refresh 🗂️ ' + previousDirHandle.name
}

browseInput.onclick = async () => {
	try {
		let dirHandle = await showDirectoryPicker()
		await set('directory', dirHandle)
		refreshInput.style.display = 'unset'
		refreshInput.textContent = 'Refresh 🗂️ ' + dirHandle.name
		readLocalDirectory(dirHandle)
	} catch (error) {
		console.error(error)
		console.table(error)
	}
}

refresh.onclick = async () => {
	try {
		let dirHandle = await get('directory')
		readLocalDirectory(dirHandle)
	} catch (error) {
		console.error(error)
		console.table(error)
	}
}

async function verifyPermission(fileHandle, readWrite) {
	const options = {}
	if (readWrite) {
		options.mode = 'read'
	}
	// Check if permission was already granted. If so, return true.
	if ((await fileHandle.queryPermission(options)) === 'granted') {
		return true
	}
	// Request permission. If the user grants permission, return true.
	if ((await fileHandle.requestPermission(options)) === 'granted') {
		return true
	}
	// The user didn't grant permission, so return false.
	return false
}

async function readLocalDirectory(dirHandle) {
	SiteLoader.show()

	await verifyPermission(dirHandle)

	const files = await listAllFilesAndDirs(dirHandle)
	gallery.innerHTML = ''
	const banners = files.reduce((acc, val) => {
		if (!Array.isArray(val)) return acc
		const index = val.find((file) => file.name === 'index.html')
		if (index) {
			return acc.concat({
				name: index.path.split('/')[1],
				path: '/fs' + index.path,
				files: val,
				type: 'html',
				size: val.map((file) => file.size).reduce((a, v) => a + v),
				mtime: val.map((file) => file.mtime).sort()[0],
			})
		}
		return acc
	}, [])

	if (banners.length > 0) localStorage.setItem('localCreatives', JSON.stringify(banners))

	show(banners)
}

function show(creatives) {
	creatives.forEach((creative) => {
		let overview = document.createElement('creative-overview')
		overview.creative = creative
		overview.src = creative.path
		gallery.appendChild(overview)
	})

	SiteLoader.hide()
}

if (localStorage.getItem('localCreatives')) {
	show(JSON.parse(localStorage.getItem('localCreatives')))
}

async function listAllFilesAndDirs(dirHandle, currentPath = '') {
	const files = []
	const promises = []
	for await (let [name, handle] of dirHandle) {
		const path = currentPath + '/' + name
		if (handle.kind === 'directory') {
			fs.mkdir(path)
			promises.push(listAllFilesAndDirs(handle, path))
		} else {
			promises.push(saveToFileSystem(path, name, handle))
		}
	}
	// return files
	return Promise.all(promises)
}

function saveToFileSystem(path, name, handle) {
	return new Promise(async (resolve, reject) => {
		const file = await handle.getFile()
		const reader = new FileReader()
		reader.onload = (e) => {
			fs.writeFile(path, Filer.Buffer.from(reader.result))
				.then(() => fs.stat(path))
				.then((stats) => {
					resolve({ path, ...stats })
				})
		}
		reader.readAsArrayBuffer(file)
	})
}
