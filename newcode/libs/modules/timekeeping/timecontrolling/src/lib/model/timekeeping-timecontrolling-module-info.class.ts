/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TIMEKEEPING_TIME_CONTROLLING_REPORT_ENTITY_INFO } from './timekeeping-time-controlling-report-entity-info.model';
import { TIMEKEEPING_TIME_CONTROLLING_BREAK_ENTITY_INFO } from './timekeeping-time-controlling-break-info.model';
import { TIMEKEEPING_TIMECONTROLLING_REPORT_VERIFICATION_ENTITY_INFO } from './timekeeping-time-controlling-report-verification-info.model';

/**
 * The module info object for the `timekeeping.timecontrolling` content module.
 */
export class TimekeepingTimecontrollingModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TimekeepingTimecontrollingModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingTimecontrollingModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingTimecontrollingModuleInfo();
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
		return 'timekeeping.timecontrolling';
	}

	/**
	 * Loads the translation file used for timekeeping
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common','timekeeping.recording','timekeeping.employee','timekeeping.common'];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			TIMEKEEPING_TIME_CONTROLLING_REPORT_ENTITY_INFO,
			TIMEKEEPING_TIME_CONTROLLING_BREAK_ENTITY_INFO,
			TIMEKEEPING_TIMECONTROLLING_REPORT_VERIFICATION_ENTITY_INFO
		];
	}
}
