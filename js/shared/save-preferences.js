// If an input has the class .save-preference, it's value is saved and retrieved in localStorage

document.querySelectorAll('.save-preference').forEach(element => {
	if (localStorage.getItem(element.id || element.name))
		element.value = localStorage.getItem(element.id || element.name)
	element.addEventListener('change', () => {
		localStorage.setItem(element.id || element.name, element.value)
	})
})