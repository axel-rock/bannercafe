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

const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
})

const campaignId = params.id

const campaign = await Campaign.fromId(campaignId)

const q = query(collection(db, Creative.COLLECTION), where('campaign', '==', campaignId))

const querySnapshot = await getDocs(q)

const creatives = querySnapshot.docs.map((doc) => new Creative(doc.data()))

creatives.map((creative) => creative.storeLocally())

show(creatives)

document.querySelector('#campaign-name').textContent = campaign.name
document.querySelector('upload-dropzone').campaign = campaignId

function show(creatives) {
	creatives.forEach((creative) => {
		let overview = document.createElement('creative-overview')
		overview.creative = creative
		overview.src = creative.path
		gallery.appendChild(overview)
	})
}

if (localStorage.getItem('distantCreatives')) {
	show(JSON.parse(localStorage.getItem('distantCreatives')))
}
