/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceRequisitionModuleInfo } from './lib/model/resource-requisition-module-info.class';

export * from './lib/resource-requisition.module';

/**
 * Returns the module info object for the resource requisition module.
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
	return ResourceRequisitionModuleInfo.instance;
}
