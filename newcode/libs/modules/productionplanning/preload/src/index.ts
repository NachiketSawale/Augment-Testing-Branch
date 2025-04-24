import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionPlanningPreloadInfo } from './lib/model/productionplanning-preload-info.class';

export * from './lib/productionplanning-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ProductionPlanningPreloadInfo.instance;
}