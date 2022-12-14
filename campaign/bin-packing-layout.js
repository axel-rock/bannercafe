import Packer from '/js/libs/bin-packing-master/packer.growing.js'

const mutationObserver = new MutationObserver(update),
	gallery = document.getElementById('gallery'),
	packer = new Packer(),
	gridCells = 20,
	gap = 1

// todo: Also add a Resize observer
mutationObserver.observe(gallery, { attributes: false, childList: true, subtree: false })

function update() {
	const creatives = [...document.querySelectorAll('#gallery > li')]

	const blocks = creatives.map((element) => {
		const maxWidth = gallery.getBoundingClientRect().width - gridCells
		const maxHeight = window.innerHeight - gridCells
		const scale = Math.min(1, maxWidth / element.creative.width, maxHeight / element.creative.height)
		const width = ~~(element.creative.width * scale)
		const height = ~~(element.creative.height * scale)
		element.style.setProperty('--compact-width', width)
		element.style.setProperty('--compact-height', height)
		return {
			element,
			// w: element.width + gap,
			// h: element.height + gap,
			w: Math.ceil((width + 1) / gridCells) * gridCells,
			h: Math.ceil((height + 1) / gridCells) * gridCells,
		}
	})

	blocks.sort((a, b) => {
		// console.log(Math.max(b.h, b.w), Math.max(a.h, a.w))
		// return Math.max(b.h, b.w) < Math.max(a.h, a.w) // Longest dimension
		// return b.h * b.w - a.h * a.w // Area
		return b.h + b.w > a.h + a.w // Perimeter
		// return b.w - a.w
	}) // sort inputs for best results

	packer.fit(blocks, gallery.clientWidth)

	blocks.forEach((block) => {
		if (!block.fit) {
			block.element.style.display = 'none'
			return
		}
		block.element.style.setProperty('--compact-left', block.fit.x)
		block.element.style.setProperty('--compact-top', block.fit.y)
		setTimeout(() => {
			// block.element.startObserver()
		}, 10)
	})

	document.getElementById('gallery').style.setProperty('--compact-height', packer.root.h)
}
