import { useState } from 'react'

import './App.css'
import { INITIAL_FORM_DATA } from './constants/constants'
import { useFormData } from './hooks/useFormData'
import { useImageUpload } from './hooks/useImageUpload'
import { Header } from './components/Header'
import { FormField, NetContentsField } from './components/FormFields'
import { ImageUpload } from './components/ImageUpload'
import { SubmitButton } from './components/SubmitButton'
import { StatusAlert } from './components/StatusAlert'

function App() {
	const { formData, handleChange, reset, setFormData } = useFormData(INITIAL_FORM_DATA)
	const { labelImage, imagePreview, processImage, clearImage, getBase64 } = useImageUpload()
	const [status, setStatus] = useState(null)
	const [dragActive, setDragActive] = useState(false)

	const API_ENDPOINT = import.meta.env.VITE_API_URL

	const canSubmit = formData.brandName.trim() && formData.productClass.trim() && formData.alcoholContent.trim() && formData.netContents.trim() && Boolean(labelImage)

	const handleAlcoholContentChange = (e) => {
		const value = e.target.value
		const percentCount = (value.match(/%/g) || []).length

		if (value === '' || (/^[\d.%]*$/.test(value) && percentCount <= 1)) {
			handleChange('alcoholContent')(e)
		}
	}

	const handleImageChange = (e) => {
		const file = e.target.files?.[0]
		if (file) processImage(file)
	}

	const handleDrag = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(e.type === 'dragenter' || e.type === 'dragover')
	}

	const handleDrop = (e) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)
		const file = e.dataTransfer.files?.[0]
		if (file) processImage(file)
	}

	const handleReset = () => {
		reset()
		clearImage()
		setStatus(null)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!canSubmit) {
			setStatus({ ok: false, message: 'Please fill all fields and attach an image.' })
			return
		}

		setStatus('sending')

		const imageBase64 = await getBase64()

		let alcoholContentValue = formData.alcoholContent.trim()

		if (alcoholContentValue && !alcoholContentValue.includes('%')) {
			alcoholContentValue = `${alcoholContentValue}%`
		}

		const payload = {
			brandName: formData.brandName,
			productClass: formData.productClass,
			alcoholContent: alcoholContentValue,
			netContents: `${formData.netContents} ${formData.netContentsUnit}`,
			labelImage: imageBase64,
		}

		try {
			const response = await fetch(`${API_ENDPOINT}/api/submit-label`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			if (!response.ok) {
				const err = await response.json().catch(() => ({}))
				setStatus({ ok: false, message: err.error || `Request failed (${response.status})` })
				return
			}

			const data = await response.json()
			setStatus({ ok: true, message: 'Submitted successfully', data })
		}
		catch (error) {
			setStatus({ ok: false, message: 'Failed to reach the server' })
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
			<div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
				<Header />

				<form onSubmit={handleSubmit} className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
					<FormField label="Brand Name" id="brandName" value={formData.brandName} onChange={handleChange('brandName')} placeholder="e.g. Acme Vodka" />
					<FormField label="Product Class/Type" id="productClass" value={formData.productClass} onChange={handleChange('productClass')} placeholder="e.g. Vodka / Spirit" />
					<FormField label="Alcohol Content" id="alcoholContent" value={formData.alcoholContent} onChange={handleAlcoholContentChange} placeholder="e.g. 40% ABV" />
					<NetContentsField formData={formData} onVolumeChange={handleChange('netContents')} onUnitChange={handleChange('netContentsUnit')} />
					<ImageUpload imagePreview={imagePreview} dragActive={dragActive} onImageChange={handleImageChange} onDrag={handleDrag} onDrop={handleDrop} onClear={clearImage} />

					<div className="flex gap-3 mt-4 sm:mt-6">
						<button
							type="button"
							onClick={handleReset}
							className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2.5 sm:py-3 rounded-lg transition duration-200 shadow-lg transform hover:scale-105 text-sm sm:text-base"
						>
							Reset
						</button>
						<SubmitButton isLoading={status === 'sending'} disabled={!canSubmit} />
					</div>
				</form>

				{status && status !== 'sending' && <StatusAlert status={status} />}
			</div>
		</div>
	)
}

export default App