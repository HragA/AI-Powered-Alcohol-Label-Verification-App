import { STYLES, VOLUME_UNITS } from '../constants/constants'

export function FormField({ label, id, value, onChange, placeholder }) {
	return (
		<div>
			<label htmlFor={id} className={STYLES.label}>
				{label}
			</label>

			<input id={id} type="text" value={value} onChange={onChange} required placeholder={placeholder} className={STYLES.input} />
		</div>
	)
}

export function NetContentsField({ formData, onVolumeChange, onUnitChange }) {
	return (
		<div>
			<label className={STYLES.label}>Net Contents</label>

			<div className="flex gap-2">
				<input
					id="netContents"
					type="number"
					step="0.01"
					value={formData.netContents}
					onChange={onVolumeChange}
					required
					placeholder="e.g. 750"
					className={`${STYLES.input} flex-1`}
				/>

				<select
					value={formData.netContentsUnit}
					onChange={onUnitChange}
					className={STYLES.select}
				>
					{VOLUME_UNITS.map((unit) => (
						<option key={unit} value={unit}>
							{unit}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}