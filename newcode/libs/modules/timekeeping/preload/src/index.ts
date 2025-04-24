import { IApplicationModuleInfo } from '@libs/platform/common';
import { TimekeepingPreloadInfo } from './lib/model/timekeeping-preload-info.class';

export * from './lib/timekeeping-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return TimekeepingPreloadInfo.instance;
}