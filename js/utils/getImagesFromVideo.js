import SCD from '/js/libs/scd/scd.js'

export default async (file) =>
	new Promise((resolve) => {
		const video = document.createElement('video')
		video.src = window.URL.createObjectURL(file)
		video.controls = true
		video.muted = true
		let thresholds = [25, 5, 1]

		video.addEventListener('loadeddata', (event) => {
			capture(thresholds.shift())
		})

		video.load()

		function capture(threshold) {
			const scd = SCD(
				video,
				{
					mode: 'FastForwardMode',
					step_width: video.videoWidth * 0.5,
					step_height: video.videoHeight * 0.5,
					minSceneDuration: Math.min(Math.max(0.5, video.duration / 20), 10), // 0.5 default
					threshold: threshold, // 25 default
				},
				saveCuts
			)

			scd.start()
			try {
				video.play()
			} catch (e) {}
		}

		async function saveCuts(cuts) {
			if (cuts.length < 2 && thresholds.length > 0) return capture(thresholds.shift())
			resolve(
				Promise.all(
					cuts.map(
						(cut, index) =>
							new Promise((resolve) => {
								cut.canvas.toBlob((blob) => {
									const ext = file.name.split('.').pop()
									blob.name = file.name.replace('.' + ext, `_${index}.png`)
									resolve(blob)
								})
							})
					)
				)
			)
		}
	})
