/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ControllingConfigurationModuleInfo } from './lib/model/controlling-configuration-module-info.class';

export * from './lib/controlling-configuration.module';
export { IMdcContrSacValueEntity } from './lib/model/entities/mdc-contr-sac-value-entity.interface';
export * from './lib/model/models';

/**
 * Returns the module info object for the controlling configuration module.
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
	return ControllingConfigurationModuleInfo.instance;
}
