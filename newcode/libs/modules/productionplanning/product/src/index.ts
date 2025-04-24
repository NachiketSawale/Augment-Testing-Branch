/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningProductModuleInfo } from './lib/model/productionplanning-product-module-info.class';

export * from './lib/productionplanning-product.module';
export * from './lib/model/wizard.class';
export * from './lib/model/productionplanning-product-complete.class';
export * from './lib/model/entities/product-entity.interface';
export * from './lib/model/models';
/**
 * Returns the module info object for the productionplanning product module.
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
	return ProductionplanningProductModuleInfo.instance;
}
