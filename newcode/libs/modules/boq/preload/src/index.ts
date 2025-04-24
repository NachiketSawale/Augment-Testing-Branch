import { IApplicationModuleInfo } from '@libs/platform/common';
import { BoqPreloadInfo } from './lib/model/boq-preload-info.class';

export * from './lib/boq-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BoqPreloadInfo.instance;
}