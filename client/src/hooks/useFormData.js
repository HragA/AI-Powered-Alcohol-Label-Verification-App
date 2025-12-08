import { useState } from 'react'

export function useFormData(initial) {
	const [formData, setFormData] = useState(initial)

	const handleChange = (field) => (e) => {
		setFormData((prev) => ({ ...prev, [field]: e.target.value }))
	}

	const reset = () => setFormData(initial)

	return { formData, handleChange, reset, setFormData }
}