/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { MtwoControltowerConfigurationModuleInfo } from './lib/model/mtwo-controltowerconfiguration-module-info.class';

export * from './lib/mtwo-controltowerconfiguration.module';

/**
 * Returns the module info object for the mtwo controltowerconfiguration module.
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
	return MtwoControltowerConfigurationModuleInfo.instance;
}
