/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ModelMainModuleInfo } from './lib/model/model-main-module-info.class';

export * from './lib/model-main.module';
export * from './lib/wizards/model-main-wizard-class';
/**
 * Returns the module info object for the model main module.
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
	return ModelMainModuleInfo.instance;
}
