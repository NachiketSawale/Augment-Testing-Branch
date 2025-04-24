/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { EstimateMainModuleInfo } from './lib/model/estimate-main-module-info.class';

export * from './lib/estimate-main.module';
export * from './lib/wizards/estimate-main-wizard-class';
export * from './lib//containers/prc-item-assignment/estimate-main-prc-item-assignment-data.service';
export * from './lib/containers/prc-item-assignment/estimate-main-prc-item-assignment-behavior.service';
export * from './lib/containers/line-item/estimate-main-line-item-data.service';
export * from './lib/wizards/estimate-main-search-copy-assemblies-wizard.service';
export * from './lib/services/calculation/estimate-main-common-calculation.service';
export * from './lib/model/interfaces/estimate-main-resource-list-interface';
export * from './lib/model/enums/estimate-main-param-structure.enum';
export * from './lib/services/lookups/estimate-line-item/estimate-line-item-lookup-provider.service';
export * from	'./lib/services/lookups/estimate-boq/estimate-main-boq-item-lookup.service';
export * from './lib/services/lookups/estimate-boq/estimate-main-boq-item-lookup-provider.service';
/**
 * Returns the module info object for the estimate main module.
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
	return EstimateMainModuleInfo.instance;
}
