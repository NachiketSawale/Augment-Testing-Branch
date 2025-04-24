/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { HsqeChecklistModuleInfo } from './lib/model/hsqe-checklist-module-info.class';

export * from './lib/hsqe-checklist.module';
export * from './lib/model/wizards/wizard.class';
export * from './lib/services/hsqe-checklist-lookup-provider.service';

/**
 * Returns the module info object for the hsqe checklist module.
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
	return HsqeChecklistModuleInfo.instance;
}
