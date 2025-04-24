/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BoqProjectModuleInfo } from './lib/model/boq-project-module-info.class';

export * from './lib/boq-project.module';
export * from './lib/model/models';
export * from './lib/model/boq-project-module-add-on.class';
export * from './lib/services/boq-project-change-boq-status-wizard.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return BoqProjectModuleInfo.instance;
}
