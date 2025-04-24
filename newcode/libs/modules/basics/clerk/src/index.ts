import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsClerkModuleInfo } from './lib/model/basics-clerk-module-info.model';

export * from './lib/basics-clerk.module';
export * from './lib/wizards/basisc-clerk-wizards.class';
export * from './lib/services/lookup-layout/basic-clerk-lookup-column-generator.service';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsClerkModuleInfo.instance;
}