/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ControllingStructureModuleInfo } from './lib/model/controlling-structure-module-info.class';

export * from './lib/controlling-structure.module';
export * from './lib/wizards/controlling-structure-change-status-wizard.service';
export * from './lib/model/entities/controlling-unit-entity.interface';

export * from './lib/services/controlling-structure-wizard.service';
export * from './lib/wizards/controlling-structure-change-company-wizard.service';
export * from './lib/services/controlling-structure-wizard.service';
export * from './lib/model/models';


export * from './lib/wizards/controlling-structure-transfer-scheduler-to-project-wizard.service';

/**
 * Returns the module info object for the controlling structure module.
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
	return ControllingStructureModuleInfo.instance;
}
