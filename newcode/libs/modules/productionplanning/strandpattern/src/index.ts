/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProductionplanningStrandpatternModuleInfo } from './lib/model/productionplanning-strandpattern-module-info.class';

export * from './lib/productionplanning-strandpattern.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ProductionplanningStrandpatternModuleInfo.instance;
}