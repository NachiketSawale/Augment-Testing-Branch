/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

/**
 * The module info object for the `defect.shared` content module.
 */
export class DefectSharedModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: DefectSharedModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): DefectSharedModuleInfo {
		if (!this._instance) {
			this._instance = new DefectSharedModuleInfo();
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
		return 'defect.shared';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Defect.Shared';
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
