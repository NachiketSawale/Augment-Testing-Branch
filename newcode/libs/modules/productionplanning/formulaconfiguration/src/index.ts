import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningFormulaconfigurationModuleInfo } from './lib/model/productionplanning-formulaconfiguration-module-info.class';
export * from './lib/productionplanning-formulaconfiguration.module';

export * from './lib/model/entities/pps-planned-quantity-entity.interface';

export function getModuleInfo(): IApplicationModuleInfo {
    return ProductionplanningFormulaconfigurationModuleInfo.instance;
}