import { IApplicationModuleInfo } from '@libs/platform/common';
import { BasicsUserformModuleInfo } from './lib/model/basics-userform-module-info.class';

export * from './lib/basics-userform.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return BasicsUserformModuleInfo.instance;
}
