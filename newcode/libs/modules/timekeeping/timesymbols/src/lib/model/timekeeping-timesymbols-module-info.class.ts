/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TIMEKEEPING_TIME_SYMBOLS_ENTITY_INFO } from './timekeeping-time-symbols-entity-info.model';
import { TIMEKEEPING_TIME_SYMBOLS2_GROUP_ENTITY_INFO } from './timekeeping-time-symbols2-group-entity-info.model';
import { TIMEKEEPING_TIME_SYMBOLS_ACCOUNT_ENTITY_INFO } from './timekeeping-time-symbols-account-entity-info.model';

/**
 * The module info object for the `timekeeping.timesymbols` content module.
 */
export class TimekeepingTimesymbolsModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TimekeepingTimesymbolsModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingTimesymbolsModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingTimesymbolsModuleInfo();
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
		return 'timekeeping.timesymbols';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ TIMEKEEPING_TIME_SYMBOLS_ENTITY_INFO, TIMEKEEPING_TIME_SYMBOLS2_GROUP_ENTITY_INFO, TIMEKEEPING_TIME_SYMBOLS_ACCOUNT_ENTITY_INFO, ];
	}
	protected override get translationContainer(): string | undefined {
		return '308ed008e88d440eaf3e5b81c96b8d26';
	}
}
