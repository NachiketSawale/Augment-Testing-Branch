/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { DrawingModuleInfo } from './lib/model/drawing-module-info.class';

export * from './lib/productionplanning-drawing.module';
export * from './lib/services/wizards/drawing-component-disable-wizard.service';
export * from './lib/services/wizards/drawing-component-enable-wizard.service';
export * from './lib/services/wizards/drawing-component-change-status-wizard.service';
export * from './lib/services/wizards/drawing-disable-wizard.service';
export * from './lib/services/wizards/drawing-enable-wizard.service';
export * from './lib/services/wizards/drawing-change-status-wizard.service';
export * from './lib/services/wizards/drawing-product-template-enable-wizard.service';
export * from './lib/services/wizards/drawing-product-template-disable-wizard.service';

/**
 * Returns the module info object for the productionplanning drawing module.
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
	return DrawingModuleInfo.instance;
}
