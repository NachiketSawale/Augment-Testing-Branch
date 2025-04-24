/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TIMEKEEPING_TIMEALLOCATION_HEADER_ENTITY_INFO } from './timekeeping-timeallocation-header-entity-info.model';
import { TIMEKEEPING_TIMEALLOCATION_ENTITY_INFO } from './timekeeping-timeallocation-entity-info.model';
import { TIMEKEEPING_TIMEALLOCATION_REPORT_ENTITY_INFO } from './timekeeping-timeallocation-report-entity-info.model';
import { TIMEKEEPING_TIMEALLOCATION_BREAK_ENTITY_INFO } from './timekeeping-timeallocation-break-entity-info.model';

/**
 * The module info object for the `timekeeping.timeallocation` content module.
 */
export class TimekeepingTimeallocationModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TimekeepingTimeallocationModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingTimeallocationModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingTimeallocationModuleInfo();
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
		return 'timekeeping.timeallocation';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Timekeeping.Timeallocation';
	}

	/**
	 * Loads the translation file used for timeallocation
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common','timekeeping.timesymbols','timekeeping.employee','timekeeping.recording','timekeeping.common'];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			TIMEKEEPING_TIMEALLOCATION_HEADER_ENTITY_INFO,
			TIMEKEEPING_TIMEALLOCATION_ENTITY_INFO,
			TIMEKEEPING_TIMEALLOCATION_REPORT_ENTITY_INFO,
			TIMEKEEPING_TIMEALLOCATION_BREAK_ENTITY_INFO
		];
	}
}
