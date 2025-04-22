/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectableInfo, ILazyInjectionContext, PlatformModuleManagerService } from '@libs/platform/common';
import { WORKFLOW_TASK_SIDEBAR_TOKEN, WORKFLOW_TASK_POPUP_SERVICE, TASK_SIDEBAR_TAB_SERVICE, USER_TASK_COMPONENT_SERVICE, WORKFLOW_INSTANCE_SERVICE, WORKFLOW_SIDEBAR_SERVICE, WORKFLOW_SIDEBAR_PIN_SERVICE, WORKFLOW_ENTITY_DATA_FACADE_LOOKUP_SERVICE, WORKFLOW_ENTITY_FACADE_LOOKUP_SERVICE } from '@libs/workflow/interfaces';


export const LAZY_INJECTABLES: LazyInjectableInfo[] =[
	LazyInjectableInfo.create('workflow.main.WorkflowMainTaskService', WORKFLOW_TASK_SIDEBAR_TOKEN, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.WorkflowMainTaskService) : null;
		
	}),

	LazyInjectableInfo.create('workflow.main.WorkflowMainTaskPopupService', WORKFLOW_TASK_POPUP_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.WorkflowMainTaskPopupService) : null;
		
	}),

	LazyInjectableInfo.create('workflow.main.WorkflowTaskSidebarTabService', TASK_SIDEBAR_TAB_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.WorkflowTaskSidebarTabService) : null;
		
	}),

	LazyInjectableInfo.create('workflow.main.UsertaskComponentMappingService', USER_TASK_COMPONENT_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.UsertaskComponentMappingService) : null;
		
	}),

	LazyInjectableInfo.create('workflow.main.WorkflowInstanceService', WORKFLOW_INSTANCE_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.WorkflowInstanceService) : null;
		
	}),

	LazyInjectableInfo.create('workflow.main.WorkflowSidebarService', WORKFLOW_SIDEBAR_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.WorkflowSidebarService) : null;
		
	}),

	LazyInjectableInfo.create('workflow.main.WorkflowSidebarPinService', WORKFLOW_SIDEBAR_PIN_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.WorkflowSidebarPinService) : null;
		
	}),

	LazyInjectableInfo.create('workflow.main.WorkflowEntityDataFacadeLookupService', WORKFLOW_ENTITY_DATA_FACADE_LOOKUP_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.WorkflowEntityDataFacadeLookupService) : null;
		
	}),

	LazyInjectableInfo.create('workflow.main.WorkflowEntityFacadeLookupService', WORKFLOW_ENTITY_FACADE_LOOKUP_SERVICE, async (context: ILazyInjectionContext) =>{
		const importedModule = await import('@libs/workflow/main');
		const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
		await platformModuleManagerService.initializeModule(importedModule);
		return context.doInstantiate ? context.injector.get(importedModule.WorkflowEntityFacadeLookupService) : null;
		
	}),
];
 