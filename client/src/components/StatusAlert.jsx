import { CheckIcon, ErrorIcon } from './Icons'

export function StatusAlert({ status }) {
	const isSuccess = status.ok
	const message = status.message
	const result = status.data?.result
	const errorMessages = result?.errors || []

	const showError = !isSuccess || (result && errorMessages.length > 0)

	return (
		<div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border-l-4 ${showError ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'} animate-slideIn`}>
			<div className="flex items-start gap-2 sm:gap-3">
				<div className="flex-shrink-0">{showError ? <ErrorIcon /> : <CheckIcon />}</div>
				<div className="flex-1 min-w-0">
					<p className="font-semibold text-sm sm:text-base">{showError ? '✗ Error' : '✓ Success'}</p>
					{showError && (
						<div className="mt-3 bg-white rounded p-2 border border-red-200">
							{!isSuccess && (
								<p className="font-semibold text-xs text-red-700 mb-2">{message}</p>
							)}

							{errorMessages.length > 0 && (
								<div>
									<p className="font-semibold text-xs text-red-700 mb-2">Inconsistencies Detected:</p>

									<div className="space-y-1">
										{errorMessages.map((message) => (
											<span key={message} className="ml-1 font-mono text-xs">{message} <br /></span>
										))}
									</div>
								</div>
							)}
						</div>
					)}

					{status.data && !errorMessages.length &&
						<div>
							<p className="font-semibold text-sm sm:text-base mt-2">The label matches the form data. All required information is consistent!</p>
						</div>
					}
				</div>
			</div>
		</div>
	)
}