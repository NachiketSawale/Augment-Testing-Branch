/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TIMEKEEPING_WORK_TIME_MODEL_ENTITY_INFO } from './timekeeping-work-time-model-entity-info.model';
import { TIMEKEEPING_WORK_TIME_DERIVATION_ENTITY_INFO } from './timekeeping-work-time-derivation-entity-info.model';
import { TIMEKEEPING_WORK_TIME_MODEL_DAY_ENTITY_INFO } from './timekeeping-work-time-model-day-entity-info.model';
import { TIMEKEEPING_TIME_SYMBOL2_WORK_TIME_MODEL_ENTITY_INFO } from './timekeeping-time-symbol2-work-time-model-entity-info.model';
import { TIMEKEEPING_WORK_TIME_MODEL_DTL_ENTITY_INFO } from './timekeeping-work-time-model-dtl-entity-info.model';

/**
 * The module info object for the `timekeeping.worktimemodel` content module.
 */
export class TimekeepingWorktimemodelModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TimekeepingWorktimemodelModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingWorktimemodelModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingWorktimemodelModuleInfo();
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
		return 'timekeeping.worktimemodel';
	}

	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common', 'scheduling.calendar', 'timekeeping.timesymbols'];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ TIMEKEEPING_WORK_TIME_MODEL_ENTITY_INFO, TIMEKEEPING_WORK_TIME_DERIVATION_ENTITY_INFO, TIMEKEEPING_WORK_TIME_MODEL_DAY_ENTITY_INFO, TIMEKEEPING_TIME_SYMBOL2_WORK_TIME_MODEL_ENTITY_INFO, TIMEKEEPING_WORK_TIME_MODEL_DTL_ENTITY_INFO, ];
	}
}
