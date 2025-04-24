/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { HsqeChecklisttemplateModuleInfo } from './lib/model/hsqe-checklisttemplate-module-info.class';

export * from './lib/hsqe-checklisttemplate.module';
export * from './lib/services/hsqe-checklist-template-lookup-provider.service';
export * from './lib/services/checklist-template-header-data-provider.service';

/**
 * Returns the module info object for the hsqe checklisttemplate module.
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
	return HsqeChecklisttemplateModuleInfo.instance;
}
