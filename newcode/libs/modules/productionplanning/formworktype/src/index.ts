import { IApplicationModuleInfo } from '@libs/platform/common';
import { FormworkTypeModuleInfo } from './lib/model/formwork-type-module-info.class';
export * from './lib/productionplanning-formwork-type.module';


export function getModuleInfo(): IApplicationModuleInfo {
    return FormworkTypeModuleInfo.instance;
}