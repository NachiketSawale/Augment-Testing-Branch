/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { EstimateRuleModuleInfo } from './lib/model/estimate-rule-module-info.class';

export * from './lib/estimate-rule.module';
export * from './lib/model/prj-est-rule-complete.class';
export * from './lib/lookup/estimate-rule-remove-lookup-provider.service';
export * from './lib/model/estimate-rule-parameter-constant';


/**
 * Returns the module info object for the estimate rule module.
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
	return EstimateRuleModuleInfo.instance;
}
