import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsRegionCatalogModuleInfo } from './lib/model/basics-region-catalog-module-info.class';

export * from './lib/basics-region-catalog.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsRegionCatalogModuleInfo.instance;
}