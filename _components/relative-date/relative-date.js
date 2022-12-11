export class RelativeDate extends HTMLElement {
	connectedCallback() {
		if (this.getAttribute('date')) this.onUpdate()
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.onUpdate()
	}

	onUpdate() {
		const date = new Date(this.getAttribute('date')),
			today = new Date(),
			spans = this.querySelectorAll('span'),
			rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }),
			units = {
				year: 24 * 60 * 60 * 1000 * 365,
				month: (24 * 60 * 60 * 1000 * 365) / 12,
				day: 24 * 60 * 60 * 1000,
				hour: 60 * 60 * 1000,
				minute: 60 * 1000,
				second: 1000,
			},
			elapsed = date - new Date()
		this.title = new Intl.DateTimeFormat('default', { dateStyle: 'full', timeStyle: 'short' }).format(date)
		for (let u in units)
			if (Math.abs(elapsed) > units[u] || u == 'second')
				return (this.innerHTML = rtf.format(Math.round(elapsed / units[u]), u))
	}

	static get observedAttributes() {
		return ['date']
	}

	get date() {
		this.getAttribute('date')
	}

	set date(value) {
		this.setAttribute('date', value)
	}
}

window.customElements.define('relative-date', RelativeDate)
