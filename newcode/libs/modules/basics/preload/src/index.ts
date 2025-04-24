import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsPreloadInfo } from './lib/model/basics-preload-info.class';
export * from './lib/basics-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsPreloadInfo.instance;
}