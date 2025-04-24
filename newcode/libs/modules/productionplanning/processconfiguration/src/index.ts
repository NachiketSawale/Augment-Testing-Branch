import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningProcessconfigurationModuleInfo } from './lib/model/productionplanning-processconfiguration-module-info.class';

export * from './lib/productionplanning-processconfiguration.module';


export function getModuleInfo(): IApplicationModuleInfo {
    return ProductionplanningProcessconfigurationModuleInfo.instance;
}