import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsCountryModuleInfo } from './lib/model/basics-country-module-info.class';

export * from './lib/basics-country.module';



export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsCountryModuleInfo.instance;
}