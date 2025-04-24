import { IApplicationModuleInfo } from '@libs/platform/common';
import { WorkflowMainModuleInfo } from './lib/model/workflow-main-module-info.class';

export { BasicsWorkflowTemplateDataService } from './lib/services/basics-workflow-template-data.service';
export * from './lib/workflow-main.module';
export * from './lib/services/workflow-sidebar/workflow-sidebar.service';
export * from './lib/services/workflow-instance/workflow-instance.service';
export * from './lib/services/user-task-services/user-tasks-mapping.service';
export * from './lib/services/workflow-lookup/action-editors/workflow-entity-data-facades-lookup.service';
export * from './lib/services/workflow-lookup/action-editors/workflow-entity-facade-lookup.service';
export * from './lib/services/workflow-sidebar-pin/workflow-sidebar-pin.service';
export * from './lib/services/task-sidebar-tab/workflow-task-sidebar-tab.service';
export * from './lib/services/workflow-main-task-popup.service';
export * from './lib/services/workflow-main-sidebar-task.service';

export function getModuleInfo(): IApplicationModuleInfo {
	return WorkflowMainModuleInfo.instance;
}