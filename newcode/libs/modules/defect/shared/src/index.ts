/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { DefectSharedModuleInfo } from './lib/model/defect-shared-module-info.class';

export * from './lib/defect-shared.module';

/**
 * Returns the module info object for the defect shared module.
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
	return DefectSharedModuleInfo.instance;
}
