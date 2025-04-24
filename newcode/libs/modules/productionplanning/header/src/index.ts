import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningHeaderModuleInfo } from './lib/model/productionplanning-header-module-info.class';
export * from './lib/productionplanning-header.module';

export * from './lib/model/wizards/pps-header-wizard.class';

export function getModuleInfo(): IApplicationModuleInfo {
    return ProductionplanningHeaderModuleInfo.instance;
}
