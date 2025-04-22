import { IApplicationModuleInfo } from '@libs/platform/common';
import { WorkflowTaskModuleInfo } from './lib/model/workflow-task-module-info.class';

export * from './lib/workflow-task.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return WorkflowTaskModuleInfo.instance;
}