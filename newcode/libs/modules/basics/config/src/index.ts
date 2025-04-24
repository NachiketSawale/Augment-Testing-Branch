/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsConfigModuleInfo } from './lib/model/basics-config-module-info.class';

export * from './lib/basics-config.module';
export * from './lib/generic-wizard/model/basics-config-generic-wizard-instance-configuration.interface';
export * from './lib/modules/model/entities/module-entity.interface';
export * from './lib/generic-wizard/model/entities/generic-wizard-instance-entity.interface';

/**
 * Returns the module info object for the basics config module.
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
	return BasicsConfigModuleInfo.instance;
}
