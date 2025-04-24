/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { DefectInterfacesModuleInfo } from './lib/model/defect-interfaces-module-info.class';

export * from './lib/defect-interfaces.module';
export * from './lib/model/entities/dfm-defect-entity.interface';
export * from './lib/model/services/defect-lookup-provider.interface';
export * from './lib/model/services/defect-header-data-provider.model';
export * from './lib/model/services/defect-header-data-provider.interface';

/**
 * Returns the module info object for the defect interfaces module.
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
	return DefectInterfacesModuleInfo.instance;
}
