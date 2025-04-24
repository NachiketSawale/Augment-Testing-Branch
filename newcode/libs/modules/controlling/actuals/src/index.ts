/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ControllingActualsModuleInfo } from './lib/model/controlling-actuals-module-info.class';

export * from './lib/controlling-actuals.module';
export * from './lib/services/Wizards/Update-Controlling-CostCodes/controlling-actuals-update-controlling-cost-code.class';
export  * from './lib/services/Wizards/update-cost-header-amount/controlling-actuals-costheader-update-amount.class';
export  * from './lib/services/Wizards/generate-preliminary/controlling-actuals-generate-preliminary-actuals.class';
export * from './lib/services/Wizards/import-itwofinance/controlling-actuals-import-itwofinance.class';
export * from './lib/services/Wizards/Update-Controlling-CostCodes/controlling-actuals-update-controlling-cost-code.class';
export * from './lib/services/Wizards/excel-impoort/controlling-actuals-excel-import.service';

/**
 * Returns the module info object for the controlling actuals module.
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
	return ControllingActualsModuleInfo.instance;
}
