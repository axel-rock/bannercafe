import Campaign from '/js/campaign.js'

const form = document.querySelector('form')

form.onsubmit = async (e) => {
	e.preventDefault()
	console.log(e)
	console.log(Campaign)
	const data = Object.fromEntries(new FormData(form))
	const campaign = new Campaign(data)
	const r = await campaign.save()
	console.log(campaign)
	window.location.replace(`/campaign/?id=${campaign.id}`)
}
