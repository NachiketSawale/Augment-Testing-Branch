import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceCatalogModuleInfo } from './lib/model/resource-catalog-module-info.class';


export * from './lib/resource-catalog.module';

// This export is for dummy grid container temporary for drag-drop service development.
// It should be removed when PlatformSourceWindowDataServiceFactory.createDataService() is available
export * from './lib/model/resource-catalog-record-entity-info.model';
export * from './lib/services/resource-catalog-record-data.service';
export * from './lib/services/resource-catalog-data.service';
export * from './lib/services/resource-catalog-price-index-data.service';
export * from './lib/behaviors/resource-catalog-record-behavior.service';
export * from './lib/model/resource-catalog-module-add-on.class';

export function getModuleInfo(): IApplicationModuleInfo {
    return ResourceCatalogModuleInfo.instance;
}