import { IApplicationModuleInfo } from '@libs/platform/common';
import { ExamplePreloadInfo } from './lib/model/example-preload-info.class';

export * from './lib/example-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ExamplePreloadInfo.instance;
}