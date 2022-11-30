import { firebaseApp } from '/js/firebase.js'
import {
	getAuth,
	signInWithRedirect,
	signOut,
	GoogleAuthProvider,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js'

export class ProfileButton extends HTMLElement {
	connectedCallback() {
		this.auth = getAuth(firebaseApp)
		this.innerHTML = `
			<style>
				@import '/_components/profile-button/profile-button.css'
			</style>
			<a href="/profile/">
				<img id="picture" src="${ProfileButton.LOGO_GOOGLE}" referrerpolicy="no-referrer"/>
				<span>Sign in</span>
			</a>
		`
		if (localStorage.getItem('user.photoURL'))
			this.querySelector('#picture').src = localStorage.getItem('user.photoURL')
		if (localStorage.getItem('user.displayName'))
			this.querySelector('span').textContent = localStorage.getItem('user.displayName')

		this.auth.onAuthStateChanged((user) => {
			if (user) {
				this.onSignIn(user)
			} else {
				this.onSignOut()
			}
		})
	}

	onSignIn(user) {
		this.user = user

		localStorage.setItem('user.photoURL', user.photoURL)
		localStorage.setItem('user.displayName', user.displayName)

		this.querySelector('#picture').src = user.photoURL
		this.querySelector('span').textContent = user.displayName
	}

	onSignOut() {
		delete this.user

		localStorage.removeItem('user.photoURL')
		localStorage.removeItem('user.displayName')
		this.querySelector('a')
		this.querySelector('#picture').src = ProfileButton.LOGO_GOOGLE
		this.querySelector('span').textContent = 'Sign in'

		this.onclick = (e) => {
			e.stopPropagation()
			e.preventDefault()
			signInWithRedirect(this.auth, new GoogleAuthProvider())
		}
	}

	static get LOGO_GOOGLE() {
		return '/img/logo_google.svg'
	}
}

window.customElements.define('profile-button', ProfileButton)
