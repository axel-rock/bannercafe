import { firebaseApp } from '/js/firebase.js'
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
const db = getFirestore(firebaseApp)

export default class Campaign {
	constructor({ name, id, isPublic = false } = {}) {
		this.name = name
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
}
