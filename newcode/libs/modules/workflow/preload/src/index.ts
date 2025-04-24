import { IApplicationModuleInfo } from '@libs/platform/common';
import { WorkflowPreloadInfo } from './lib/model/workflow-preload-info.class';

export * from './lib/workflow-preload.module';

export function getModuleInfo(): IApplicationModuleInfo {
    return WorkflowPreloadInfo.instance;
}