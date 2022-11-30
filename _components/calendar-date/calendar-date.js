export class CalendarDate extends HTMLElement {
	connectedCallback() {
		const date = new Date(this.getAttribute('date')),
			today = new Date(),
			spans = this.querySelectorAll('span'),
			relevantLowerPartInfo = date.getYear() == today.getYear() ?
				new Intl.DateTimeFormat('default', {timeStyle: 'short'}).format(date) :
				new Intl.DateTimeFormat('default', {year: 'numeric'}).format(date)

		this.innerHTML = `
			<style>
				@import '/_components/calendar-date/calendar-date.css'
			</style>
			<time datetime="${date.toISOString()}" title="${new Intl.DateTimeFormat('default', {dateStyle: 'full', timeStyle: 'short'}).format(date)}">
				<span>${new Intl.DateTimeFormat('default', {month: 'short'}).format(date)}</span>
				<span>${new Intl.DateTimeFormat('default', {day: 'numeric'}).format(date)}</span>
				<span>${relevantLowerPartInfo}</span>
			</time>
		`
	}
}

window.customElements.define('calendar-date', CalendarDate)