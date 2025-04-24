/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { QtoFormulaModuleInfo } from './lib/model/qto-formula-module-info.class';

export * from './lib/qto-formula.module';

export * from './lib/services/qto-formula-script-validation-data.service';
export * from './lib/model/entities/qto-formula-script-trans-entity.interface';

/**
 * Returns the module info object for the qto formula module.
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
	return QtoFormulaModuleInfo.instance;
}
