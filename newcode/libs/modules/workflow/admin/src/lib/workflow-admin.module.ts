/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiCommonModule } from '@libs/ui/common';
import { RouterModule, Routes } from '@angular/router';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { WorkflowAdminModuleInfo } from './model/worflow-admin-module-info.class';
import { WorkflowInstanceContextComponent } from './components/workflow-instance-context-container/workflow-instance-context.component';
import { WorkflowActionInstanceContextComponent } from './components/workflow-action-instance-context-container/workflow-action-instance-context.component';
import { WorkflowDataHubComponent } from './components/workflow-data-hub-container/workflow-data-hub.component';

/**
 * Adds a default route to render containers to workflow admin module
 */
const routes: Routes = [new ContainerModuleRoute(WorkflowAdminModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, FormsModule, UiCommonModule, RouterModule.forChild(routes)],
	declarations: [WorkflowInstanceContextComponent, WorkflowActionInstanceContextComponent, WorkflowDataHubComponent],
})
export class WorkflowAdminModule {}
