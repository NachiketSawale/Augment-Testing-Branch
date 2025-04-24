/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { EstimateCommonModuleInfo } from './lib/model/estimate-common-module-info.class';
export * from './lib/estimate-common.module';
export { EstimateCommonOverlayDialog } from './lib/estimate-common-overlay-dialog/estimate-common-overlay-dialog';

/**
 * Returns the module info object for the estimate common module.
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
	return EstimateCommonModuleInfo.instance;
}

export * from './lib/services/estimate-common-item-info.service';
export * from './lib/services/estimate-common-create.service';
export * from './lib/services/estimate-common-filter.service';
