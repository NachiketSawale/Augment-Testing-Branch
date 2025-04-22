import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProcurementPreloadInfo } from './lib/model/procurement-preload-info.class';

export * from './lib/procurement-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ProcurementPreloadInfo.instance;
}