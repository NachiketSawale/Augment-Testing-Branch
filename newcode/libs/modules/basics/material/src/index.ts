/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsMaterialModuleInfo } from './lib/model/basics-material-module-info.class';

export * from './lib/basics-material.module';
export * from './lib/model/wizards/wizard.class';
export * from './lib/portion/basics-material-portion-data.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return BasicsMaterialModuleInfo.instance;
}

export * from './lib/scope/basics-material-scope-layout.service';
export * from './lib/scope/basics-scope-validation-service-factory.service';
export * from './lib/scope-detail/basics-material-scope-detail-layout.service';
export * from './lib/scope-detail/basics-scope-detail-validation-service-factory.service';
export * from './lib/material/basics-material-common-layout.service';