/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsControllingcostcodesModuleInfo } from './lib/model/basics-controllingcostcodes-module-info.class';

export * from './lib/basics-controllingcostcodes.module';
export * from './lib/wizards/basics-controlling-costcodes-wizards';


/**
 * Returns the module info object for the basics controlling costcodes module.
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
	return BasicsControllingcostcodesModuleInfo.instance;
}