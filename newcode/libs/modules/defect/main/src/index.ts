/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { DefectMainModuleInfo } from './lib/model/defect-main-module-info.class';

export * from './lib/defect-main.module';
export * from './lib/model/wizards/wizard.class';
export * from './lib/services/lookup-services/defect-lookup-provider.service';
export * from './lib/services/defect-main-header-data.service';
export * from './lib/services/lazy-injections/defect-data-provider.service';

/**
 * Returns the module info object for the defect main module.
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
	return DefectMainModuleInfo.instance;
}
