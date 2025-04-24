import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsUnitModuleInfo } from './lib/model/basics-unit-module-info.class';

export * from './lib/basics-unit.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsUnitModuleInfo.instance;
}