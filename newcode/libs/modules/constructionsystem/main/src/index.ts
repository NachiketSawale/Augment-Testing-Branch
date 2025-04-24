/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ConstructionsystemMainModuleInfo } from './lib/model/constructionsystem-main-module-info.class';

export * from './lib/constructionsystem-main.module';
export * from './lib/services/construction-system-main-instance-data.service'; //todo	need remove to shared/interface ?
export * from './lib/services/wizard/construction-system-main-reset-instance-parameters-wizard.service';
export * from './lib/services/wizard/construction-system-main-apply-lineitem-to-estimate-wizard.service';
export * from './lib/services/wizard/construction-system-main-wizard.service';
export * from './lib/services/wizard/construction-sysem-main-create-instance-wizard.service';
export * from './lib/services/lookup/construction-system-main-instance-header-parameter-lookup.service';
export * from './lib/services/wizard/construction-system-main-bulk-assignment-wizard.service';

/**
 * Returns the module info object for the constructionsystem main module.
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
	return ConstructionsystemMainModuleInfo.instance;
}
