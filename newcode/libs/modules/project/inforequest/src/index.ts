/*
 * Copyright(c) RIB Software GmbH
 */
import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectInfoRequestModuleInfo } from './lib/model/project-info-request-module-info.class';

export * from './lib/project-info-request.module';
export * from './lib/wizards/project-info-request-wizards.class';

export function getModuleInfo(): IApplicationModuleInfo {
	return ProjectInfoRequestModuleInfo.instance;
}
