import { IApplicationModuleInfo } from '@libs/platform/common';
import { BoqWicModuleInfo } from './lib/model/boq-wic-module-info.class';

export * from './lib/boq-wic.module';
export * from './lib/model/models';
export * from './lib/services/boq-wic-wizard.service';
export * from './lib/services/boq-wic-lookup.service';

export function getModuleInfo(): IApplicationModuleInfo {
    return BoqWicModuleInfo.instance;
}