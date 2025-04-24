/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { CONTROLLING_ACTUALS_COST_HEADER_ENTITY_INFO } from './controlling-actuals-cost-header-entity-info.model';
import { CONTROLLING_ACTUALS_COST_DATA_ENTITY_INFO } from './controlling-actuals-cost-data-entity-info.model';

/**
 * The module info object for the `controlling.actuals` content module.
 */
export class ControllingActualsModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ControllingActualsModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ControllingActualsModuleInfo {
		if (!this._instance) {
			this._instance = new ControllingActualsModuleInfo();
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
		return 'controlling.actuals';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Controlling.Actuals';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ CONTROLLING_ACTUALS_COST_HEADER_ENTITY_INFO,
			CONTROLLING_ACTUALS_COST_DATA_ENTITY_INFO,
		];
	}
}
