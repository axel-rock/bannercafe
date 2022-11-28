import Creative from '/js/creative.js'
import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
const db = getFirestore(firebaseApp)
import { get } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
})
const campaignId = params.campaign
let creative, creatives
try {
	creative = await get(Creative.fromObject(params.id))
	creatives = await getCreatives(campaignId)
} catch (e) {
	creatives = await getCreatives(campaignId)
	creative = creatives.find((creative) => creative.id == params.id)
}
setNextAndPrev()

async function getCreatives(campaignId) {
	const querySnapshot = await getDocs(query(collection(db, Creative.COLLECTION), where('campaign', '==', campaignId)))
	const creatives = querySnapshot.docs.map((doc) => Creative.fromObject(doc.data()))
	return creatives
}

function setNextAndPrev() {
	const index = creatives.findIndex((creative) => creative.id === params.id)
	document.querySelector('#prev').href = `/creative/?id=${
		creatives[(index + creatives.length - 1) % creatives.length].id
	}&campaign=${campaignId}`
	document.querySelector('#next').href = `/creative/?id=${
		creatives[(index + 1) % creatives.length].id
	}&campaign=${campaignId}`
}

let preview

switch (creative.type) {
	case 'html':
		preview = document.createElement('iframe')
		preview.width = creative.width
		preview.height = creative.height
		preview.creative = creative
		await creative.storeLocally()
		console.log(
			creative,
			creative.files.find((file) => file.endsWith('index.html'))
		)
		preview.src = '/fs/' + creative.files.find((file) => file.endsWith('index.html'))
		break
	case 'png':
	case 'jpg':
		preview = document.createElement('img')
		preview.width = creative.width
		preview.height = creative.height
		preview.src = creative.path
		break
	case 'psd':
		preview = document.createElement('img')
		preview.width = creative.width
		preview.height = creative.height
		preview.src = creative.path.replace('.psd', '.png')
		break
	case 'mp4':
		preview = document.createElement('video')
		preview.controls = true
		preview.preload = 'metadata'
		preview.src = await creative.getDownloadURL()
		break
}

document.querySelector('#preview').appendChild(preview)

if (creative.height > creative.width && creative.height > window.innerHeight * 0.3) {
	// preview.classList.add('tall')
}

document.querySelector('#width').textContent = creative.width + 'px'
document.querySelector('#height').textContent = creative.height + 'px'
document.querySelector('#name').innerHTML = creative.name.replaceAll('_', '_<wbr>')
document.querySelector('#updated').innerHTML = `<calendar-date date="${creative.timestamp.toDate()}"></calendar-date>`
document.querySelector('#size').innerHTML = Creative.humanFileSize(creative.size)

// function getCreative(id) {
// 	return creatives[index]
// }
