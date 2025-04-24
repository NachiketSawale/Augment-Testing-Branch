/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningProducttemplateModuleInfo } from './lib/model/productionplanning-product-template-module-info.class';

export * from './lib/productionplanning-product-template.module';
export * from './lib/model/wizard.class';

/**
 * Returns the module info object for the productionplanning producttemplate module.
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
	return ProductionplanningProducttemplateModuleInfo.instance;
}
