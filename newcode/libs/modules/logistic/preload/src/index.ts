import { IApplicationModuleInfo } from '@libs/platform/common';
import { LogisticPreloadInfo } from './lib/model/logistic-preload-info.class';

export * from './lib/logistic-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return LogisticPreloadInfo.instance;
}