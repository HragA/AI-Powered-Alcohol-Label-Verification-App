export const STYLES = {
	input: 'w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition duration-200 text-sm',
	label: 'block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2',
	select: 'px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition duration-200 text-sm bg-white',
}

export const INITIAL_FORM_DATA = {
	brandName: '',
	productClass: '',
	alcoholContent: '',
	netContents: '',
	netContentsUnit: 'mL',
}

export const VOLUME_UNITS = ['mL', 'L', 'oz']