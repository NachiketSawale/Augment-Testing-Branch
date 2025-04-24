import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsBankModuleInfo } from './lib/model/basics-bank-module-info.class';

export * from './lib/basics-bank.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsBankModuleInfo.instance;
}