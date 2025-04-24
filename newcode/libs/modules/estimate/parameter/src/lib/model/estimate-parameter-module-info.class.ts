/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ESTIMATE_PARAMETER_PRJ_PARAM_ENTITY_INFO } from './estimate-parameter-prj-param-entity-info.model';

/**
 * The module info object for the `estimate.parameter` content module.
 */
export class EstimateParameterModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: EstimateParameterModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): EstimateParameterModuleInfo {
		if (!this._instance) {
			this._instance = new EstimateParameterModuleInfo();
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
		return 'estimate.parameter';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ESTIMATE_PARAMETER_PRJ_PARAM_ENTITY_INFO];
	}
}
