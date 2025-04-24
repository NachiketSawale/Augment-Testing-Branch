/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { CloudTranslationModuleInfo } from './lib/model/cloud-translation-module-info.class';

export * from './lib/cloud-translation.module';
export * from './lib/model/wizards/cloud-translation-wizard.class';

/**
 * Returns the module info object for the cloud translation module.
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
	return CloudTranslationModuleInfo.instance;
}
