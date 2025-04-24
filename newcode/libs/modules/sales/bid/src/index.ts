/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SalesBidModuleInfo } from './lib/model/sales-bid-module-info.class';

export * from './lib/sales-bid.module';
export * from './lib/wizards/index';

/**
 * Returns the module info object for the sales bid module.
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
	return SalesBidModuleInfo.instance;
}
