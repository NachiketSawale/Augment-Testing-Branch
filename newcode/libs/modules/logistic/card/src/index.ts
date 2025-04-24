/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticCardModuleInfo } from './lib/model/logistic-card-module-info.class';

export * from './lib/logistic-card.module';
export * from './lib/model/wizards/logistic-card-wizard.class';
export * from './lib/services/logistic-card-lookup-provider.service';

/**
 * Returns the module info object for the logistic card module.
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
	return LogisticCardModuleInfo.instance;
}


