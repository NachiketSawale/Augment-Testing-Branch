/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo} from '@libs/ui/business-base';

/**
 * The module info object for the `estimate.common` content module.
 */
export class EstimateCommonModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: EstimateCommonModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): EstimateCommonModuleInfo {
		if (!this._instance) {
			this._instance = new EstimateCommonModuleInfo();
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
		return 'estimate.common';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [];
	}
}
