/*
 * Copyright(c) RIB Software GmbH
 */

import { ModuleInfoBase } from '@libs/platform/common';

/**
 * The module info object for the `model.project` content module.
 */
export class ModelProjectModuleInfo extends ModuleInfoBase {
	
	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static readonly instance = new ModelProjectModuleInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'model.project';
	}
}
