/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SalesContractModuleInfo } from './lib/model/sales-contract-module-info.class';

export * from './lib/sales-contract.module';
export * from './lib/model/wizards/sales-contract-main-wizard';
export * from './lib/lookup-helper/sales-contract-lookup-overload-provider.class';
export * from './lib/model/entities/sales-contract-bill-type-entity.interface';
export * from './lib/lookup-services/sales-biiling-type-lookup.service';
export * from './lib/lookup-services/sales-contract-previous-bill-lookup.service';

/**
 * Returns the module info object for the sales contract module.
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
	return SalesContractModuleInfo.instance;
}
