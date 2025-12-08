import { LoadingSpinner } from './Icons'

export function SubmitButton({ isLoading, disabled }) {
	return (
		<button
			type="submit"
			disabled={isLoading || disabled}
			className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 sm:py-3 rounded-lg transition duration-200 shadow-lg transform hover:scale-105 text-sm sm:text-base"
		>
			{isLoading ? (
				<span className="flex items-center justify-center">
					<LoadingSpinner />
					Submitting...
				</span>
			) : (
				'Submit'
			)}
		</button>
	)
}