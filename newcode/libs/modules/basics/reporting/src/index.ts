/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsReportingModuleInfo } from './lib/model/basics-reporting-module-info.class';

export * from './lib/basics-reporting.module';

export * from './lib/model/entities/report-entity.interface';

export * from './lib/model/entities/report-parameter-entity.interface';

/**
 * Returns the module info object for the basics reporting module.
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
	return BasicsReportingModuleInfo.instance;
}
