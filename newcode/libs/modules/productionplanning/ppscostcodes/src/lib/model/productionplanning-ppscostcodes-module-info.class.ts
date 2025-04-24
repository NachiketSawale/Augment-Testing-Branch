/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PPS_COST_CODES_ENTITY_INFO } from './pps-cost-codes-entity-info.model';

/**
 * The module info object for the `productionplanning.ppscostcodes` content module.
 */
export class ProductionplanningPpscostcodesModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningPpscostcodesModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningPpscostcodesModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningPpscostcodesModuleInfo();
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
		return 'productionplanning.ppscostcodes';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Productionplanning.Ppscostcodes';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [PPS_COST_CODES_ENTITY_INFO];
	}

	/**
	 * Loads the translation file used for PPS Header
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['basics.costcodes', 'cloud.common']);
	}
}
