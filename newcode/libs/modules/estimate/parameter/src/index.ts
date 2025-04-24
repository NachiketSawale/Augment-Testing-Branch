/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { EstimateParameterModuleInfo } from './lib/model/estimate-parameter-module-info.class';

export * from './lib/estimate-parameter.module';
export * from './lib/model/estimate-parameter-prj-param-entity-info.model';
export * from './lib/services/estimate-parameter-update.service';
/**
 * Returns the module info object for the estimate parameter module.
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
	return EstimateParameterModuleInfo.instance;
}
