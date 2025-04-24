/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementOrderproposalsModuleInfo } from './lib/model/procurement-orderproposals-module-info.class';

export * from './lib/procurement-orderproposals.module';
export * from './lib/services/procurement-order-proposals-grid-data.service';
export * from './lib/model/entities/order-proposal-entity.interface';
export * from './lib/services/wizards/procurement-order-proposals-create-contract-requisition-wizard.service';

/**
 * Returns the module info object for the procurement orderproposals module.
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
	return ProcurementOrderproposalsModuleInfo.instance;
}
