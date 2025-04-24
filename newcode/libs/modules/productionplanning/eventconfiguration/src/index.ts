import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningEventconfigurationModuleInfo } from './lib/model/productionplanning-eventconfiguration-module-info.class';

export * from './lib/productionplanning-eventconfiguration.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ProductionplanningEventconfigurationModuleInfo.instance;
}