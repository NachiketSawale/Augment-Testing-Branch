import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningDrawingtypeModuleInfo } from './lib/model/productionplanning-drawingtype-module-info.class';

export * from './lib/productionplanning-drawingtype.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ProductionplanningDrawingtypeModuleInfo.instance;
}