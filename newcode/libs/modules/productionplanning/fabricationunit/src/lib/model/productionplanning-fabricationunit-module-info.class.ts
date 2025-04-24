/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PPS_FABRICATIONUNIT_ENTITY_INFO } from './pps-fabricationunit-entity-info.model';
import { PPS_NESTING_ENTITY_INFO } from './pps-nesting-entity-info.model';

/**
 * The module info object for the `productionplanning.fabricationunit` content module.
 */
export class ProductionplanningFabricationunitModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningFabricationunitModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningFabricationunitModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningFabricationunitModuleInfo();
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
		return 'productionplanning.fabricationunit';
	}

	public override get internalPascalCasedModuleName(): string {
		return 'Productionplanning.Fabricationunit';
	}

	public override get moduleName(): Translatable {
		return { key: 'cloud.desktop.moduleDisplayNameProductionplanningFabricationunit' };
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [PPS_FABRICATIONUNIT_ENTITY_INFO, PPS_NESTING_ENTITY_INFO,];
	}
}
