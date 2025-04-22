/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ModelMeasurementsModuleInfo } from './lib/model/model-measurements-module-info.class';

export * from './lib/model-measurements.module';

/**
 * Returns the module info object for the model measurements module.
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
	return ModelMeasurementsModuleInfo.instance;
}
