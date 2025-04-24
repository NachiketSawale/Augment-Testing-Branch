/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PPS_ENGINEERING_CAD_IMPORT_CONFIG_ENTITY_INFO } from './cad-import-config-entity-info.model';
import { PPS_ENGINEERING_CAD_VALIDATION_ENTITY_INFO } from './cad-validation-entity-info.model';

/**
 * The module info object for the `productionplanning.cadimportconfig` content module.
 */
export class ProductionplanningCadimportconfigModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ProductionplanningCadimportconfigModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProductionplanningCadimportconfigModuleInfo {
		if (!this._instance) {
			this._instance = new ProductionplanningCadimportconfigModuleInfo();
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
		return 'productionplanning.cadimportconfig';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'ProductionPlanning.CadImportConfig';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ 
			PPS_ENGINEERING_CAD_IMPORT_CONFIG_ENTITY_INFO, 
			PPS_ENGINEERING_CAD_VALIDATION_ENTITY_INFO, 
		];
	}
}
