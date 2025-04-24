/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningCadimportconfigModuleInfo } from './lib/model/productionplanning-cadimportconfig-module-info.class';

export * from './lib/productionplanning-cadimportconfig.module';

/**
 * Returns the module info object for the productionplanning cadimportconfig module.
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
	return ProductionplanningCadimportconfigModuleInfo.instance;
}
