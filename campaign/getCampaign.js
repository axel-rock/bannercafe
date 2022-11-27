import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	collection,
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
	const querySnapshot = await getDocs(query(collection(db, Creative.COLLECTION), where('campaign', '==', campaignId)))
	const creatives = querySnapshot.docs.map((doc) => new Creative(doc.data()))

	// await creatives.map((creative) => creative.storeLocally())

	show(creatives)
}

// if (localStorage.getItem('distantCreatives')) {
// 	show(JSON.parse(localStorage.getItem('distantCreatives')))
// }

function show(creatives) {
	creatives.forEach((creative) => {
		let overview = document.createElement('creative-overview')
		overview.creative = creative
		overview.src = creative.path
		gallery.appendChild(overview)
	})
}
