import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	doc,
	getDoc,
	setDoc,
	collection,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
const db = getFirestore(firebaseApp)
import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'

export default class Campaign {
	constructor({ id, name, client, owner, isPublic = false } = {}) {
		this.id = id
		this.name = name
		this.client = client
		this.owner = owner
		// this.id = name
		this.isPublic = isPublic
	}

	static get COLLECTION() {
		return 'campaigns'
	}

	static async fromId(id) {
		try {
			const docRef = doc(db, Campaign.COLLECTION, id)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				return new Campaign(docSnap.data())
			} else {
				// doc.data() will be undefined in this case
				console.log('No such document!')
			}
		} catch (e) {
			console.error(e)
		}
	}

	async save() {
		this.owner ??= await get('user')
		if (!this.id) {
			console.log(Campaign.COLLECTION)
			const ref = doc(collection(db, Campaign.COLLECTION))
			this.id = ref.id
			const { ...campaign } = this
			await setDoc(ref, campaign)
			return this
		}
	}
}
