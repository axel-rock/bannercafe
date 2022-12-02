// let template
import { firebaseApp } from '/js/firebase.js'
import {
	getFirestore,
	collection,
	// collectionGroup,
	query,
	orderBy,
	// where,
	getDocs,
	serverTimestamp,
	doc,
	setDoc,
} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
const db = getFirestore(firebaseApp)
import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js'

class FirestoreComments extends HTMLElement {
	static get observedAttributes() {
		return ['ref']
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.getMessages()
	}

	async connectedCallback() {
		this.user = await get('user')
		if (!this.template) {
			this.template = await fetch('/_components/firestore-comments/firestore-comments.html')
			this.template = await this.template.text()
		}
		this.innerHTML = this.template
		this.form = this.querySelector('form')
		this.form.addEventListener('submit', (e) => {
			e.preventDefault()
			try {
				this.saveMessage(this.quill.getContents())
			} catch (e) {
				console.error("Couldn't save your message")
				console.error(e)
			}

			return false
		})

		this.quill = new Quill('#editor', {
			placeholder: 'Type your comment...',
			theme: 'snow',
		})
	}

	async saveMessage(delta) {
		const ref = doc(collection(db, this.getAttribute('ref')))
		console.log(delta)
		return setDoc(ref, {
			id: ref.id,
			content: { ...delta },
			timestamp: serverTimestamp(),
			// answerTo
			user: this.user,
		})
	}

	async getMessages() {
		const ref = collection(db, this.getAttribute('ref'))
		const docs = await getDocs(query(ref, orderBy('timestamp')))
		docs.forEach((doc) => {
			this.createMessage(doc.data())
		})
	}

	createMessage(data) {
		const ul = this.querySelector('ul')
		const element = document.createElement('li')
		element.user = data.user.uid
		element.innerHTML = `
			<img src="${data.user.photoURL}"/>
			<span class="username">${data.user.displayName}</span>
			<relative-date date="${data.timestamp.toDate()}"></relative-date>
			<div class="content"></div>
		`
		element.quill = new Quill(element.querySelector('.content'), {
			readOnly: true,
		})
		element.quill.setContents(data.content)
		if (ul.lastChild?.user == data.user.uid) element.classList.add('no-profile')
		ul.appendChild(element)
	}

	get ref() {
		this.getAttribute('ref')
	}

	set ref(value) {
		this.setAttribute('ref', [value])
	}
}

window.customElements.define('firestore-comments', FirestoreComments)
