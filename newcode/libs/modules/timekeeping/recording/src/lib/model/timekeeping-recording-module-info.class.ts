/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TIMEKEEPING_RECORDING_ENTITY_INFO } from './timekeeping-recording-entity-info.model';
import { TIMEKEEPING_RECORDING_REPORT_ENTITY_INFO } from './timekeeping-recording-report-entity-info.model';
import { TIMEKEEPING_RECORDING_SHEET_ENTITY_INFO } from './timekeeping-recording-sheet-entity-info.model';
import { TIMEKEEPING_RECORDING_RESULT_ENTITY_INFO } from './timekeeping-recording-result-entity-info.model';
import { TIMEKEEPING_RECORDING_BREAK_ENTITY_INFO } from './timekeeping-recording-break-entity-info.model';
import { TIMEKEEPING_EMP_REPORT_VERIFICATION_ENTITY_INFO } from './timekeeping-emp-verification-entity.info.model';
import { TIMEKEEPING_RECORDING_VALIDATION_ENTITY_INFO } from './timekeeping-recording-validation-entity-info.model';

/**
 * The module info object for the `timekeeping.recording` content module.
 */
export class TimekeepingRecordingModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TimekeepingRecordingModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingRecordingModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingRecordingModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'timekeeping.recording';
	}

	/**
	 * Loads the translation file used for timekeeping
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common','timekeeping.timesymbols','timekeeping.employee','timekeeping.common','timekeeping.period','basics.customize','procurement.invoice'];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ TIMEKEEPING_RECORDING_ENTITY_INFO,
					TIMEKEEPING_RECORDING_REPORT_ENTITY_INFO,
					TIMEKEEPING_RECORDING_SHEET_ENTITY_INFO,
					TIMEKEEPING_RECORDING_RESULT_ENTITY_INFO,
					TIMEKEEPING_RECORDING_BREAK_ENTITY_INFO,
			TIMEKEEPING_EMP_REPORT_VERIFICATION_ENTITY_INFO,
			TIMEKEEPING_RECORDING_VALIDATION_ENTITY_INFO];
	}
}
