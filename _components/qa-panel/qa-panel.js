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

export class QAPanel extends HTMLElement {
	static get observedAttributes() {
		return ['ref']
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.getQA()
	}

	async connectedCallback() {
		this.user = await get('user')
	}

	update() {
		console.log(window)
		const supportedBrowsers = [
			{
				browser: {
					name: 'Chrome',
				},
				os: {
					name: 'Android',
				},
			},
			{
				browser: {
					name: 'Chrome',
				},
				platform: {
					type: 'desktop',
				},
			},
			{
				browser: {
					name: 'Safari',
				},
				platform: {
					type: 'mobile',
				},
			},
			{
				browser: {
					name: 'Edge',
				},
			},
			{
				browser: {
					name: 'Safari',
				},
				platform: {
					type: 'desktop',
				},
			},
			{
				browser: {
					name: 'Firefox',
				},
			},
			{
				browser: {
					name: 'Samsung Internet for Android',
				},
			},
		]

		const rules = [
			'All technical functionality work',
			'Animations run as expected',
			'Creative matches design',
			'Creative follows brand guidelines',
			'All assets are loaded',
			'Clicktag is working',
			'Creative is under file size limits',
			'Creative scales correctly',
			'Images are not blurry',
			'Text is readable',
			'Interactions (:hover) work as expected',
			'Creative has contrasting borders',
		]

		const browser = bowser.getParser(window.navigator.userAgent).parsedResult

		this.innerHTML = `
		<style>
			@import '/_components/qa-panel/qa-panel.css'
		</style>
		<div class="legend"s>Browsers</div>`

		supportedBrowsers.forEach((supportedBrowser) => {
			const cell = document.createElement('div')
			cell.classList.add('header')
			let icons = Object.values(supportedBrowser)
				.map((properties) => Object.values(properties))
				.flat(2)
				.map((name) => name.toLowerCase().replaceAll(' ', '-'))

			icons.forEach((icon) => {
				const img = document.createElement('img')
				img.src = `/_components/qa-panel/icons/${icon}.svg`
				img.classList.add('icon', icon)
				cell.appendChild(img)
			})

			if (objectMatch(supportedBrowser, browser)) cell.classList.add('current')
			this.appendChild(cell)
		})

		this.style.setProperty('--columns', supportedBrowsers.length)

		rules.forEach((rule) => {
			const row = document.createElement('div')
			row.classList.add('row')
			const legend = document.createElement('div')
			legend.classList.add('rule')
			legend.textContent = rule
			row.appendChild(legend)

			const list = document.createElement('ul')
			supportedBrowsers.forEach((supportedBrowser) => {
				const cell = document.createElement('li')
				cell.classList.add('cell')
				cell.title = JSON.stringify(supportedBrowser)

				const matchingEntries = this.entries.filter(
					(entry) => entry.rule === rule && objectMatch(supportedBrowser, entry)
				)

				if (objectMatch(supportedBrowser, browser)) {
					const input = document.createElement('input')
					input.type = 'checkbox'
					input.onchange = () => {
						if (input.checked) this.save(rule, browser, true)
						else this.save(rule, browser, false)
					}
					input.checked = matchingEntries.length > 0 ? matchingEntries[0].approved : false
					cell.appendChild(input)
				} else {
					if (matchingEntries.length > 0) cell.textContent = matchingEntries[0].approved ? '✅' : '❌'
					else cell.textContent = '-'
				}

				cell.addEventListener('click', () => {
					console.log(matchingEntries)
					this.showDetails(matchingEntries)
				})
				list.appendChild(cell)
			})
			row.appendChild(list)
			this.appendChild(row)
		})

		const details = document.createElement('ul')
		details.id = 'details'
		details.classList.add('comments')
		this.appendChild(details)
	}

	save(rule, browser, approved) {
		const ref = doc(collection(db, [this.getAttribute('ref')].join('/')))
		return setDoc(ref, {
			...browser,
			rule,
			approved,
			timestamp: serverTimestamp(),
			window: {
				devicePixelRatio: window.devicePixelRatio,
				innerWidth: window.innerWidth,
				innerHeight: window.innerHeight,
			},
			user: this.user,
		})
	}

	showDetails(entries) {
		const details = this.querySelector('#details')
		details.innerHTML = ''
		entries.forEach((entry) => {
			const li = document.createElement('li')
			li.classList.add('comment')
			li.innerHTML = `
			<img src="${entry.user.photoURL}"/>
			<span>${entry.user.displayName}</span>
			<span>${entry.approved ? 'approved ✅' : 'rejected ❌'} "${entry.rule}" on ${entry.browser.name}</span>
			<relative-date date="${entry.timestamp.toDate()}"></relative-date>

			<details class="content">
				<summary>Show browser informations</summary>
				<pre><code></code></pre>
			</details>`
			details.appendChild(li)
			li.querySelector('code').innerHTML += JSON.stringify(
				{ browser: entry.browser, platform: entry.platform, os: entry.os, engine: entry.engine, window: entry.window },
				null,
				2
			)
		})
	}

	async getQA() {
		const ref = collection(db, this.getAttribute('ref'))
		const docs = await getDocs(query(ref, orderBy('timestamp', 'desc')))
		this.entries = docs.docs.map((doc) => doc.data())
		this.update()
	}

	get ref() {
		this.getAttribute('ref')
	}

	set ref(value) {
		this.setAttribute('ref', [value])
	}
}

function objectMatch(browser1, browser2) {
	let match = true
	Object.keys(browser1).forEach((key) => {
		if (typeof browser1[key] === 'object') {
			if (objectMatch(browser1[key], browser2[key]) === false) match = false
		} else {
			if (browser1[key] !== browser2[key]) match = false
		}
	})
	return match
}

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
function hashCode(input) {
	var output = ''
	for (var i = 0; i < input.length; i++) {
		if (input.charCodeAt(i) <= 127) {
			output += input.charAt(i)
		} else {
			output += '&#' + input.charCodeAt(i) + ';'
		}
	}
	return output.replaceAll('__.*__', '').replaceAll('/', '_')
}

window.customElements.define('qa-panel', QAPanel)
