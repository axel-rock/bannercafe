import {testUnits} from '../testlist.js'
import Creative from '/js/creative.js'

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})

const creatives = JSON.parse(localStorage.getItem('localCreatives')),
  creative = getCreative(params.name),
  preview = document.querySelector('html-banner')

console.log(creative)

preview.creative = creative
preview.src = creative.path

document.querySelector('#width').textContent = preview.width + 'px'
document.querySelector('#height').textContent = preview.height + 'px'
document.querySelector('#name').textContent = creative.name
document.querySelector('#updated').innerHTML = `<calendar-date date="${creative.mtime}"></calendar-date>`
document.querySelector('#size').innerHTML = Creative.humanFileSize(creative.size)

function getCreative(name) {
  const index = !name ? 0 : creatives.findIndex(creative => creative.name === name)
  console.log(index, name)
  document.querySelector('#prev').href = `/details/?name=${creatives[(index + creatives.length - 1) % creatives.length].name}`
  document.querySelector('#next').href = `/details/?name=${creatives[(index + 1) % creatives.length].name}`
  return creatives[index]
}