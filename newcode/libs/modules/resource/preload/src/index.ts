import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourcePreloadInfo } from './lib/model/resource-preload-info.class';

export * from './lib/resource-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ResourcePreloadInfo.instance;
}