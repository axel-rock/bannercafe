// https://github.com/humphd/nohost
const Filer = window.Filer
const fs = new Filer.FileSystem().promises
import { showDirectoryPicker } from 'https://cdn.jsdelivr.net/npm/file-system-access/lib/es2018.js'

if(!('serviceWorker' in navigator)) {
	console.warn('unable to initialize nohost service worker: not supported.');
} else {
	navigator.serviceWorker
		.register('/nohost-sw.js') // see configuration options below
		.catch(err => {
			console.error(`unable to register nohost service worker: ${err.message}`)
		})
		.then(() => {
			document.getElementById('browse').style.display = 'unset'
		})
}

// Local files
const gallery = document.querySelector('#gallery')
const input = document.getElementById('browse')
input.onclick = async () => {
	let dirHandle = await showDirectoryPicker()
	const files = await listAllFilesAndDirs(dirHandle)
	gallery.innerHTML = ''
	const banners = files
		.reduce((acc, val) => {
			if (!Array.isArray(val))
				return acc
			const index = val.find(file => file.name === 'index.html')
			if (index) {
				return acc.concat({
					name: index.path.split('/')[1],
					path: '/fs' + index.path,
					files: val,
					type: 'html',
					size: val.map(file => file.size).reduce((a, v) => a + v),
					mtime: val.map(file => file.mtime).sort()[0],
				})
			}
			return acc
		}, [])

	if (banners.length > 0)
		localStorage.setItem('localCreatives', JSON.stringify(banners))

	show(banners)
}

function show(creatives) {
	creatives.forEach(creative => {
		let overview = document.createElement('creative-overview')
		overview.creative = creative
		overview.src = creative.path
		gallery.appendChild(overview)
	})
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
		reader.onload = e => {
			fs.writeFile(path, Filer.Buffer.from(reader.result))
				.then(() => fs.stat(path))
				.then(stats => {
					resolve({path, ...stats})
				})
		}
		reader.readAsArrayBuffer(file)
	})
}