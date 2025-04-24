import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsIndextableModuleInfo } from './lib/model/basics-indextable-module-info.class';

export * from './lib/basics-indextable.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsIndextableModuleInfo.instance;
}