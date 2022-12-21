import { firebaseApp } from '/js/firebase.js'
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
const db = getFirestore(firebaseApp)

export default class User {
	constructor({ uid, displayName, photoURL, company } = {}) {
		this.uid = uid
		this.displayName = displayName
		this.photoURL = photoURL
		this.company = company
	}

	static get COLLECTION() {
		return 'users'
	}

	static async fromId(id) {
		try {
			const docRef = doc(db, User.COLLECTION, id)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				return new User(docSnap.data())
			} else {
				// doc.data() will be undefined in this case
				console.log('No such document!')
			}
		} catch (e) {
			console.error(e)
		}
	}
}
