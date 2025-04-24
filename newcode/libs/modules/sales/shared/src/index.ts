/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SalesSharedModuleInfo } from './lib/model/sales-shared-module-info.class';

export * from './lib/sales-shared.module';
export * from './lib/lookup-helper/sales-shared-customized-lookup-overload-provider.service';
export * from './lib/model/entities/shared-mandatory-deadlines-entity.interface';
export * from './lib/model/shared-mandatory-deadlines.model';
export * from './lib/lookup-services/sales-shared-wip-lookup.service';
export * from './lib/lookup-services/sales-shared-billing-lookup.service';
export * from './lib/model/entity-info/sales-shared-entity-info.service';
export * from './lib/model/entities/sales-shared-generals-entity-generated.interface';
export * from './lib/model/entities/sales-shared-generals-entity.interface';
export * from './lib/model/entities/sales-configuration-header-entity.interface';
export * from './lib/lookup-services/sales-common-contract-lookup.service';
export * from './lib/lookup-services/sales-common-bill-lookup.service';

/**
 * Returns the module info object for the sales shared module.
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
	return SalesSharedModuleInfo.instance;
}
