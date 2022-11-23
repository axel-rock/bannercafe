export class UploadDropzone extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<style>
			@import '/components/upload-dropzone/upload-dropzone.css'
		</style>
		<div>Upload dropzone</div>
		`
	}
}

window.customElements.define('upload-dropzone', UploadDropzone)
