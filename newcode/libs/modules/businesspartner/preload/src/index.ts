import { IApplicationModuleInfo } from '@libs/platform/common';
import { BusinessPartnerPreloadInfo } from './lib/model/module-preload-info.class';

export * from './lib/businesspartner-preload.module';


export function getModuleInfo(): IApplicationModuleInfo {
    return BusinessPartnerPreloadInfo.instance;
}