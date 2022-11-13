import { firebaseApp } from '/js/firebase.js'
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js'
const auth = getAuth(firebaseApp)

auth.onAuthStateChanged((user) => {
	console.log(user)
	if (user) {
		fillUserInfos(user)
	} else {
		onSignOut()
	}

	document.querySelector('#sign-out').onclick = () => {
		signOut(auth)
	}
})

function fillUserInfos(user) {
	for (var key in user) {
		if (user.hasOwnProperty(key)) {
			const element = document.querySelector('.user-' + key)
			if (element) {
				switch (element.tagName) {
					case 'IMG':
						element.onerror = () => {
							if (element.classList.contains('user-photoURL'))
								element.src = 'https://eu.ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName)
						}
						element.src = user[key]
						break
					default:
						element.textContent = user[key]
				}
			}
		}
	}

	document.querySelector('.user-metadata-creationTime').textContent = new Intl.DateTimeFormat().format(
		new Date(user.metadata.creationTime)
	)
}

function onSignOut() {
	document.location.href = '/'
}
