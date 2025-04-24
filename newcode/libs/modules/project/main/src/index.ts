import { IApplicationModuleInfo } from '@libs/platform/common';
import { ProjectMainModuleInfo } from './lib/model/project-main-module-info.class';

export * from './lib/project-main.module';
export * from './lib/wizards/project-main-wizards.class';
export * from './lib/services/project-main-action-validation.service';
export * from './lib/services/project-lookup-provider.service';
export * from './lib/services/project-main-layout.service';
export * from './lib/services/project-main-prj-2-business-partner-layout.service';
export * from './lib/services/project-main-prj-2-bpcontact-layout.service';
export function getModuleInfo(): IApplicationModuleInfo {
    return ProjectMainModuleInfo.instance;
}