import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	// collection,
	collectionGroup,
	query,
	where,
	getDocs,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
import { getStorage, ref, getBytes } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js'
import Campaign from '/js/campaign.js'
import Creative from '/js/creative.js'

const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

// Get URL Parameters
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
})
const campaignId = params.id

getCampaign(campaignId)
getCreatives(campaignId)

async function getCampaign(campaignId) {
	const campaign = await Campaign.fromId(campaignId)
	document.querySelector('#campaign-name').textContent = campaign.name
	document.querySelector('upload-dropzone').campaign = campaignId
}

async function getCreatives(campaignId) {
	const querySnapshot = await getDocs(
		query(collectionGroup(db, Creative.COLLECTION), where('campaign', '==', campaignId))
	)
	const creatives = querySnapshot.docs.map((doc) => Creative.fromObject(doc.data()))
	show(creatives)
}

// if (localStorage.getItem('distantCreatives')) {
// 	show(JSON.parse(localStorage.getItem('distantCreatives')))
// }

function show(creatives) {
	creatives.forEach((creative) => {
		const template = document.querySelector('#creative-overview')
		const overview = template.content.cloneNode(true)
		overview.querySelector('.name').textContent = creative.name
		overview.querySelector('.type').textContent = creative.type
		overview.querySelector('.size').textContent = Creative.humanFileSize(creative.size)
		overview.querySelector('relative-date').setAttribute('date', creative.timestamp.toDate())
		overview.querySelector('li').creative = creative
		const preview = creative.asHTML()
		preview.classList.add('preview')
		overview.querySelector('a').prepend(preview)
		overview.querySelector(
			'a'
		).href = `/creative/?creativeId=${creative.creativeId}&versionId=${creative.versionId}&campaign=${creative.campaign}`
		gallery.appendChild(overview)
	})
}
