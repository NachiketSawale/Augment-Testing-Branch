/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementPesModuleInfo } from './lib/model/procurement-pes-module-info.class';

export * from './lib/procurement-pes.module';
export * from './lib/wizards';
/**
 * Returns the module info object for the procurement pes module.
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
	return ProcurementPesModuleInfo.instance;
}
