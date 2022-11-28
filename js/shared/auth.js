import { set, del } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'
import { firebaseApp } from '/js/firebase.js'
import {
	getAuth,
	signInWithRedirect,
	signOut,
	GoogleAuthProvider,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js'

const auth = getAuth(firebaseApp)

auth.onAuthStateChanged((user) => {
	if (user) {
		set('user', (({ uid, displayName, photoURL }) => ({ uid, displayName, photoURL }))(user))
		if (user.uid === 'GEyvgboge7R4xbqeDYskbjf8wQM2')
			document.querySelectorAll('.admin-only').forEach((element) => {
				element.style.display = 'inline-flex'
			})
	} else {
		del('user')
		document.querySelectorAll('.admin-only').forEach((element) => {
			element.style.display = 'none'
		})
	}
})
