/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { TIMEKEEPING_PERIOD_ENTITY_INFO } from './timekeeping-period-entity-info.model';
import { TIMEKEEPING_PERIOD_TRANSACTION_ENTITY_INFO } from './timekeeping-period-transaction-entity-info.model';
import { TIMEKEEPING_PERIOD_VALIDATION_ENTITY_INFO } from './timekeeping-period-validation-entity-info.model';

/**
 * The module info object for the `timekeeping.period` content module.
 */
export class TimekeepingPeriodModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: TimekeepingPeriodModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): TimekeepingPeriodModuleInfo {
		if (!this._instance) {
			this._instance = new TimekeepingPeriodModuleInfo();
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
		return 'timekeeping.period';
	}
	/**
	 * Loads the translation file used for period
	 */
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common','timekeeping.common','basics.customize','procurement.invoice'];
	}
	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ TIMEKEEPING_PERIOD_ENTITY_INFO, TIMEKEEPING_PERIOD_TRANSACTION_ENTITY_INFO, TIMEKEEPING_PERIOD_VALIDATION_ENTITY_INFO, ];
	}

	/**
	 * Override this to auto-generate a translation container with the specified UUID.
	 * The default implementation returns `undefined`, in which no translation container
	 * will be automatically added to the module.
	 */
	protected override get translationContainer(): string | undefined {
		return '31e3362580964f09a27a7e1bb35acfa6';
	}

}
