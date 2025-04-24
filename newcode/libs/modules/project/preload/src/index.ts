import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectPreloadInfo } from './lib/model/project-preload-info.class';

export * from './lib/project-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ProjectPreloadInfo.instance;
}