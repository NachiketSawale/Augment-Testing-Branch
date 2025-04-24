import { IApplicationModuleInfo } from '@libs/platform/common';
import { WorkflowAdminModuleInfo } from './lib/model/worflow-admin-module-info.class';

export * from './lib/workflow-admin.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return WorkflowAdminModuleInfo.instance;
}