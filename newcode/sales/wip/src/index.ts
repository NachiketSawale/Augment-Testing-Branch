/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { SalesWipModuleInfo } from './lib/model/sales-wip-module-info.class';

export * from './lib/sales-wip.module';
export * from './lib/model/wizards/sales-wip-main-wizard';
export * from './lib/model/entities/generals-entity.interface';
export * from './lib/model/entities/document-entity.interface';

/**
 * Returns the module info object for the sales wip module.
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
	return SalesWipModuleInfo.instance;
}
