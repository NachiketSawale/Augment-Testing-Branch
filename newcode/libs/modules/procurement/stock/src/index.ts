/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementStockModuleInfo } from './lib/model/procurement-stock-module-info.class';

export * from './lib/procurement-stock.module';
export * from './lib/services/procurement-stock-alternative-dialog.service';
export * from './lib/wizards';

/**
 * Returns the module info object for the procurement stock module.
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
	return ProcurementStockModuleInfo.instance;
}

