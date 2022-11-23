import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	collection,
	query,
	where,
	limit,
	getDocs,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
const db = getFirestore(firebaseApp)

try {
	const campaignsRef = collection(db, 'campaigns')
	const q = query(campaignsRef, where('owner.uid', '==', 'GEyvgboge7R4xbqeDYskbjf8wQM2'))
	const querySnapshot = await getDocs(q)
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		const campaign = doc.data()
		const li = document.createElement('li')
		document.querySelector('#campaigns').appendChild(li)

		const link = document.createElement('a')
		link.href = '/campaign/?id=' + doc.id
		link.textContent = campaign.name
		li.appendChild(link)
	})
} catch (e) {
	console.error(e)
}
