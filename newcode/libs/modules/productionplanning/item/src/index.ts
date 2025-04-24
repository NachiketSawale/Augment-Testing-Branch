/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { PpsItemModuleInfo } from './lib/model/pps-item-module-info.class';

export * from './lib/pps-item.module';

export * from './lib/model/pps-upstream-goods-types.constant';
export { PpsUpstreamItemEntityInfoFactory } from './lib/services/upstream-item/pps-upstream-item-entity-info-factory.service';
export { IPpsUpstreamItemEntity } from './lib/model/entities/pps-upstream-item-entity.interface';
export { IPPSItemEntity } from './lib/model/entities/pps-item-entity.interface';
export * from './lib/services/upstream-item/pps-upstream-item-shared';

export * from './lib/model/wizards/pps-item-wizard.class';
export * from './lib/model/models';

/**
 * Returns the module info object for the productionplanning item module.
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
	return PpsItemModuleInfo.instance;
}
