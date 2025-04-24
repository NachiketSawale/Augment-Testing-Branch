import { IApplicationModuleInfo } from '@libs/platform/common';
import { SchedulingPreloadInfo } from './lib/model/scheduling-preload-info.class';

export * from './lib/scheduling-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return SchedulingPreloadInfo.instance;
}