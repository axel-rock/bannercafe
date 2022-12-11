import Creative from '/js/creative.js'
import Campaign from '/js/campaign.js'
import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	collection,
	collectionGroup,
	query,
	orderBy,
	where,
	getDocs,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
const db = getFirestore(firebaseApp)
import { get } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
const MESSAGES_COLLECTION = 'messages'
const QA_COLLECTION = 'qa'
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
})
const campaignId = params.campaign
let creative, creatives
try {
	creative = await get(Creative.fromObject(params.versionId))
	creatives = await getCreatives(campaignId)
} catch (e) {
	creatives = await getCreatives(campaignId)
	creative = creatives.find((creative) => creative.creativeId == params.creativeId)
}

setNextAndPrev()
await getVersions()

async function getCreatives(campaignId) {
	const querySnapshot = await getDocs(
		query(collectionGroup(db, Creative.COLLECTION), where('campaign', '==', campaignId))
	)
	return querySnapshot.docs.map((doc) => Creative.fromObject(doc.data()))
}

async function getVersions() {
	const querySnapshot = await getDocs(
		query(
			collection(
				db,
				Campaign.COLLECTION,
				campaignId,
				Creative.COLLECTION,
				creative.creativeId,
				Creative.VERSION_COLLECTION
			),
			orderBy('timestamp', 'desc')
		)
	)
	let versions = querySnapshot.docs.map((doc) => Creative.fromObject(doc.data()))
	versions.forEach(async (version) => {
		if (version.versionId === params.versionId) {
			creative = version
		}
		const ul = document.querySelector('#versions ul')
		const li = document.createElement('li')
		li.innerHTML = `
			<a href="/creative/?creativeId=${version.creativeId}&versionId=${version.versionId}&campaign=${
			version.campaign
		}" class="${version.versionId === params.versionId ? 'current' : ''} button">
				<img src="${version.user.photoURL}"/>
				<span class="username">${version.user.displayName}</span>
				<relative-date date="${version.timestamp.toDate()}"></relative-date>
			</a>
		`
		ul.appendChild(li)
	})
	await creative.storeLocally()
}

function setNextAndPrev() {
	const index = creatives.findIndex((creative) => creative.versionId === params.versionId)
	const prev = creatives[(index + creatives.length - 1) % creatives.length]
	const next = creatives[(index + 1) % creatives.length]
	document.querySelector(
		'#prev'
	).href = `/creative/?creativeId=${prev.creativeId}&versionId=${prev.versionId}&campaign=${campaignId}`
	document.querySelector(
		'#next'
	).href = `/creative/?creativeId=${next.creativeId}&versionId=${next.versionId}&campaign=${campaignId}`
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

if (creative.height >= creative.width && creative.height > window.innerHeight * 0.3) {
	preview.classList.add('tall')
}

document.querySelector('firestore-comments').ref = [
	Campaign.COLLECTION,
	campaignId,
	Creative.COLLECTION,
	creative.creativeId,
	MESSAGES_COLLECTION,
].join('/')

document.querySelector('qa-panel').ref = [
	Campaign.COLLECTION,
	campaignId,
	Creative.COLLECTION,
	creative.creativeId,
	QA_COLLECTION,
].join('/')
document.querySelector('#campaign').href = `/campaign/?id=${campaignId}`
document.querySelector('#type').textContent = creative.type
document.querySelector('#width').textContent = creative.width + 'px'
document.querySelector('#height').textContent = creative.height + 'px'
document.querySelector('#name').innerHTML = creative.name.replaceAll('_', '_<wbr>')
document.querySelector('#updated').innerHTML = `<calendar-date date="${creative.timestamp.toDate()}"></calendar-date>`
document.querySelector('#size').innerHTML = Creative.humanFileSize(creative.size)

const tags = [
	...creative.name.split('.')[0].split('_'),
	creative.dimensions,
	creative.type,
	Creative.humanFileSize(creative.size),
]
tags.forEach((tag) => {
	document.querySelector('#tags>ul').innerHTML += `
	<li>
	${tag}
	</li>
	`
})

// function getCreative(id) {
// 	return creatives[index]
// }
