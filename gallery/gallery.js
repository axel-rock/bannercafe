import {testUnits} from '/testlist.js'
import Packer from '/libs/bin-packing-master/packer.growing.js'

const mutationObserver = new MutationObserver(update),
  gallery = document.getElementById('gallery'),
  packer = new Packer(),
  gridCells = 20,
  gap = 1

// todo: Also add a Resize observer
mutationObserver.observe(gallery, {attributes: false, childList: true, subtree: false})

function update() {
  const creatives = [...document.querySelectorAll('creative-overview')]

  const blocks = creatives.map((element) => {
    return {
      element,
      // w: element.width + gap,
      // h: element.height + gap,
      w: Math.ceil((element.width + 1) / gridCells) * gridCells,
      h: Math.ceil((element.height + 1) / gridCells) * gridCells,
    }
  })

  blocks.sort((a, b) => {
    // console.log(Math.max(b.h, b.w), Math.max(a.h, a.w))
    // return Math.max(b.h, b.w) < Math.max(a.h, a.w) // Longest dimension
    // return (b.h * b.w) - (a.h * a.w) // Area
    // return (b.h + b.w) > (a.h + a.w) // Perimeter
    return b.w - a.w
  }) // sort inputs for best results


  packer.fit(blocks, gallery.clientWidth)

  console.groupCollapsed('Gallery')

  blocks.forEach((block) => {
    if (!block.fit) {
      console.log(block, 'doesnt fit')
      block.element.style.display = 'none'
      return
    }
    block.element.style.setProperty('--compact-width', block.w - gap)
    block.element.style.setProperty('--compact-height', block.h - gap)
    block.element.style.setProperty('--compact-left', block.fit.x)
    block.element.style.setProperty('--compact-top', block.fit.y)
  })

  console.groupEnd('Gallery')

  document.getElementById('gallery').style.setProperty('--compact-height', packer.root.h)
}

// testUnits
//   .sort((a, b) => 0.5 - Math.random())
//   .slice(0, 3)
//   .forEach((unit) => {
//     const creative = document.createElement('creative-overview')
//     creative.src = '/test/' + unit + '/index.html'
//     creative.id = unit
//     gallery.appendChild(creative)
//   })