import { IApplicationModuleInfo } from '@libs/platform/common';
import { QtoPreloadInfo } from './lib/model/qto-preload-info.class';

export * from './lib/modules-qto-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return QtoPreloadInfo.instance;
}