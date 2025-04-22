import { IApplicationModuleInfo } from '@libs/platform/common';
import { ModelPreloadInfo } from './lib/model/model-preload-info.class';

export * from './lib/model-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ModelPreloadInfo.instance;
}