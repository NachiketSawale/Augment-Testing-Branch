import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsTaxCodeModuleInfo } from './lib/model/basics-tax-code-module-info.class';
export * from './lib/basics-taxcode.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsTaxCodeModuleInfo.instance;
}