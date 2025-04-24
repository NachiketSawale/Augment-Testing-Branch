/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticPriceconditionModuleInfo } from './lib/model/logistic-pricecondition-module-info.class';

export * from './lib/logistic-pricecondition.module';

/**
 * Returns the module info object for the logistic pricecondition module.
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
	return LogisticPriceconditionModuleInfo.instance;
}
