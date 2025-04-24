/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementInventoryModuleInfo } from './lib/model/procurement-inventory-module-info.class';
export * from './lib/wizards';
export * from './lib/model/models';
export * from './lib/procurement-inventory.module';
export * from './lib/model/wizards/wizard.class';
export * from './lib/model/wizards/wizard.class';
export * from './lib/lookups/procurement-inventory-header-lookup.service';

/**
 * Returns the module info object for the procurement inventory module.
 *
 * This function implements the {@link IApplicationModule.getModuleInfo} method.
 * Do not remove it.
 * It may be called by generated code.
 *
 * @return The singleton instance of the module info object.
 *
 * @see {@link IApplicationModule.getModuleInfo}
 */
export function getModuleInfo(): IApplicationModuleInfo {
	return ProcurementInventoryModuleInfo.instance;
}
