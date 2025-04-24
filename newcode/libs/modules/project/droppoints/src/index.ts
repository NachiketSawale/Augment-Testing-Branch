import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectDropPointsModuleInfo } from './lib/model/project-drop-points-module-info.class';

export * from './lib/project-drop-points.module';

export function getModuleInfo(): IApplicationModuleInfo {
	return ProjectDropPointsModuleInfo.instance;
}

export * from './lib/services/project-drop-points-lookup-provider.service';