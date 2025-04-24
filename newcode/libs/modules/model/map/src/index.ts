/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ModelMapModuleInfo } from './lib/model/model-map-module-info.class';

export * from './lib/model-map.module';
export * from './lib/wizards/model-map-wizard-class';

/**
 * Returns the module info object for the model map module.
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
	return ModelMapModuleInfo.instance;
}
