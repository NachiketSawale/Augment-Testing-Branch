/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementRequisitionModuleInfo } from './lib/model/procurement-requisition-module-info.class';

export * from './lib/model/wizards/wizards.class';
export * from './lib/procurement-requisition.module';

export * from './lib/model/wizards/wizards.class';
export * from './lib/model/entities/requisition-complete-entity.class';
export * from './lib/model/entities/req-variant-entity.interface';
export * from './lib/model/entities/req-item-variant-entity.interface';
export * from './lib/model/entities/req-boq-variant-entity.interface';
export * from './lib/wizards';
/**
/**
 * Returns the module info object for the procurement requisition module.
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
	return ProcurementRequisitionModuleInfo.instance;
}
