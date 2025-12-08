import { STYLES } from '../constants/constants'
import { PictureIcon, CloseIcon } from './Icons'

export function ImageUpload({ imagePreview, dragActive, onImageChange, onDrag, onDrop, onClear }) {
	return (
		<div>
			<label className={STYLES.label}>Alcohol Label Image</label>

			{!imagePreview ? (
				<UploadArea dragActive={dragActive} onImageChange={onImageChange} onDrag={onDrag} onDrop={onDrop} />
			) : (
				<ImagePreview imagePreview={imagePreview} onClear={onClear} />
			)}
		</div>
	)
}

function UploadArea({ dragActive, onImageChange, onDrag, onDrop }) {
	return (
		<div className="relative" onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}>
			<input id="labelImage" type="file" accept="image/*" onChange={onImageChange} className="hidden" />
			<label
				htmlFor="labelImage"
				className={`flex items-center justify-center w-full px-3 sm:px-4 py-6 sm:py-8 border-2 border-dashed rounded-lg cursor-pointer transition duration-200 ${dragActive ? 'border-amber-500 bg-amber-50 scale-105' : 'border-gray-300 hover:border-amber-500 hover:bg-amber-50'
					}`}
			>
				<div className="text-center pointer-events-none">
					<PictureIcon />
					<p className="text-xs sm:text-sm text-gray-600">{dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}</p>
					<p className="text-xs text-gray-500 mt-1">PNG, JPG/JPEG, GIF up to 10MB</p>
				</div>
			</label>
		</div>
	)
}

function ImagePreview({ imagePreview, onClear }) {
	return (
		<div className="relative">
			<img src={imagePreview} alt="Preview" className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg border-2 border-amber-200" />

			<button type="button" onClick={onClear} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 sm:p-2 shadow-lg transform hover:scale-110 transition duration-200">
				<CloseIcon />
			</button>
		</div>
	)
}