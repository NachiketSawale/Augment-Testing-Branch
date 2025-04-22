/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SalesInterfacesModuleInfo } from './lib/model/sales-interfaces-module-info.class';

export * from './lib/sales-interfaces.module';
export * from './lib/model/lookup/sales-shared-lookup-provider.interface';
export * from './lib/model/lookup/sales-shared-wip-billing-lookup-entity.interface';

// Bid
export * from './lib/model/entities/bid/index';
// Billing
export * from './lib/model/entities/billing/index';
// WIP
export * from './lib/model/entities/wip/index';
// Contract
export * from './lib/model/entities/contract/index';

//common
export * from './lib/model/entities/common/index';



/**
 * Returns the module info object for the sales interfaces module.
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
	return SalesInterfacesModuleInfo.instance;
}
