import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsCustomizeModuleInfo } from './lib/model/basics-customize-module-info.class';
export * from './lib/basics-customize.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsCustomizeModuleInfo.instance;
}