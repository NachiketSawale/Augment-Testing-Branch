/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase } from '@libs/ui/business-base';

/**
 * The module info object for the `sales.common` content module.
 */
export class SalesCommonModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new SalesCommonModuleInfo();

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'sales.common';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Sales.Common';
	}

}
