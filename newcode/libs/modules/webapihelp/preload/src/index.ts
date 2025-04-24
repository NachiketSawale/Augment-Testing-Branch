import { IApplicationModuleInfo } from '@libs/platform/common';
import { WebapiPreloadInfo } from './lib/model/webapi-preload-info.class';

export * from './lib/webapihelp-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return WebapiPreloadInfo.instance;
}

