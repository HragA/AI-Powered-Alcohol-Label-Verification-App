import { useState } from 'react'

export function useImageUpload() {
	const [labelImage, setLabelImage] = useState(null)
	const [imagePreview, setImagePreview] = useState(null)

	const processImage = (file) => {
		if (!file || !file.type.startsWith('image/')) return

		setLabelImage(file)

		const reader = new FileReader()

		reader.onload = (event) => setImagePreview(event.target?.result)
		reader.readAsDataURL(file)
	}

	const clearImage = () => {
		setLabelImage(null)
		setImagePreview(null)
	}

	const getBase64 = () =>
		new Promise((resolve) => {
			if (!labelImage) {
				resolve(null)
				return
			}
			const reader = new FileReader()
			reader.onload = (event) => resolve(event.target?.result)
			reader.readAsDataURL(labelImage)
		})

	return { labelImage, imagePreview, processImage, clearImage, getBase64 }
}