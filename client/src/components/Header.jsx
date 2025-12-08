import { BottleIcon } from './Icons'

export function Header() {
	return (
		<div className="mb-6 sm:mb-8 text-center">
			<div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-3 sm:mb-4">
				<BottleIcon />
			</div>
			<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Label Verification</h1>
			<p className="text-gray-300 text-xs sm:text-sm">Submit alcohol product details for verification</p>
		</div>
	)
}