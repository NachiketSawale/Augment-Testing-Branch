import { IApplicationModuleInfo } from '@libs/platform/common';
import { ResourceWotModuleInfo } from './lib/model/resource-wot-module-info.class';
export * from './lib/modules-resource-wot.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return ResourceWotModuleInfo.instance;
}