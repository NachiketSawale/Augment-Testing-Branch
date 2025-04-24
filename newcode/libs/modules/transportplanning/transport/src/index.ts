/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { TransportplanningTransportModuleInfo } from './lib/model/transportplanning-transport-module-info.class';

export * from './lib/transportplanning-transport.module';

/**
 * Returns the module info object for the transportplanning transport module.
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
	return TransportplanningTransportModuleInfo.instance;
}
