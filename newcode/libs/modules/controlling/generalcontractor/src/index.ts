/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ControllingGeneralContractorModuleInfo } from './lib/model/controlling-generalcontractor-module-info.class';

export * from './lib/controlling-generalcontractor.module';
export * from './lib/services/controlling-general-contractor-wizard-service';

/**
 * Returns the module info object for the controlling generalcontractor module.
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
	return ControllingGeneralContractorModuleInfo.instance;
}
