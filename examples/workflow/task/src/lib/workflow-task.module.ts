/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowTaskModuleInfo } from './model/workflow-task-module-info.class';

/**
 * Adds a default route to render containers to workflow task module.
 */
const routes: Routes = [new ContainerModuleRoute(WorkflowTaskModuleInfo.instance)];

/**
 * Workflow task module.
 */
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class WorkflowTaskModule {
}
