import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { WorkflowPreloadInfo } from './model/workflow-preload-info.class';

@NgModule({
	imports: [CommonModule],
})
export class WorkflowPreloadModule {
	public constructor(moduleManager: PlatformModuleManagerService) {
		moduleManager.registerPreloadModule(WorkflowPreloadInfo.instance);
	}
}
