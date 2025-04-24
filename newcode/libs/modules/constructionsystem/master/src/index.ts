/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ConstructionsystemMasterModuleInfo } from './lib/model/constructionsystem-master-module-info.class';

export * from './lib/constructionsystem-master.module';
export * from './lib/services/lookup/construction-system-master-boq-item-reference-lookup.service';
export * from './lib/model/wizards/wizard.class';

/**
 * Returns the module info object for the constructionsystem master module.
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
	return ConstructionsystemMasterModuleInfo.instance;
}
