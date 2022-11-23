import { firebaseApp } from '/js/firebase.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
import { getStorage, ref, getBytes } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js'
import Campaign from '/js/campaign.js'
const Filer = window.Filer
const fs = new Filer.FileSystem().promises
const firestore = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
})

const campaign = await Campaign.fromId(params.id)

console.log(campaign)

document.querySelector('#campaign-name').textContent = campaign.name

// const directory = '/test/epson_t3170m_300x250/'
// const files = [
// 	'txt1.png',
// 	'txt2.png',
// 	'productLogo.png',
// 	'banner.js',
// 	'style.css',
// 	'logo.png',
// 	'printoutPhoto.jpg',
// 	'printoutVector.png',
// 	'txtLegal.png',
// 	'txtCta.png',
// 	'arm.png',
// 	'GSDevTools.min.js',
// 	'product.jpg',
// 	'index.html',
// 	'txtCtaHover.png',
// ]

// const directory = '/test/Holiday22_AT-DE_BFW_DD003_DerStandard_standalone_300x600_html_0411/'
// const files = [
// 	'banner.js',
// 	'bg.jpg',
// 	'ember_bold.woff2',
// 	'ember_regular.woff2',
// 	'Holiday22_AT-DE_BFW_DD003_DerStandard_standalone_300x600_html_0411.jpg',
// 	'index.html',
// 	'snowflake1.png',
// 	'snowflake2.png',
// 	'snowflake3.png',
// 	'snowflake4.png',
// 	'snowflake5.png',
// 	'style.css',
// 	'yeti.jpg',
// 	'yetiMask.png',
// ]

// try {
// 	await fs.mkdir('/test')
// 	await fs.mkdir(directory)
// } catch (e) {
// 	console.error(e)
// }

// Promise.all(
// 	files.map(
// 		(file) =>
// 			new Promise((resolve, reject) => {
// 				const path = directory + file
// 				try {
// 					getBytes(ref(storage, path))
// 						.then((bytes) => fs.writeFile('/' + path, Filer.Buffer.from(bytes)))
// 						.then(() => fs.stat(path))
// 						.then((stats) => {
// 							resolve({ path, ...stats })
// 						})
// 				} catch (e) {
// 					console.error(e)
// 				}
// 			})
// 	)
// ).then((banners) => {
// 	banners = [banners].reduce((acc, val) => {
// 		if (!Array.isArray(val)) return acc
// 		const index = val.find((file) => file.name === 'index.html')
// 		if (index) {
// 			return acc.concat({
// 				// name: index.path.split('/')[1],
// 				name: encodeURIComponent(index.path.split('/').slice(1, -1).join('/')),
// 				path: '/fs' + index.path,
// 				files: val,
// 				type: 'html',
// 				size: val.map((file) => file.size).reduce((a, v) => a + v),
// 				mtime: val.map((file) => file.mtime).sort()[0],
// 			})
// 		}
// 		return acc
// 	}, [])
//
// 	if (banners.length > 0) localStorage.setItem('distantCreatives', JSON.stringify(banners))
//
// 	show(banners)
// })

// function show(creatives) {
// 	creatives.forEach((creative) => {
// 		let overview = document.createElement('creative-overview')
// 		overview.creative = creative
// 		overview.src = creative.path
// 		gallery.appendChild(overview)
// 	})
// }
//
// if (localStorage.getItem('distantCreatives')) {
// 	show(JSON.parse(localStorage.getItem('distantCreatives')))
// }
