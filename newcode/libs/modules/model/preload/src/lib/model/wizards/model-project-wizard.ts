/*
 * Copyright(c) RIB Software GmbH
 */


import { IWizard, PlatformModuleManagerService } from '@libs/platform/common';

export const MODEL_PROJECT_WIZARD : IWizard[] = [
	{
		uuid: '1b69cc700c1047938c12210a82d4c7cf',
		name: 'model.project.changeModelStatus',
		execute: async (context) => {
			const importedModule = await import('@libs/model/project');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelProjectWizard().changeModelStatus(context));
		},
	},
	{
		uuid: 'cebd8a2a1add4a1cb189118a1a73eccd',
		name: 'model.project.resetModelFileStateTitle',
		execute: async (context) => {
			const importedModule = await import('@libs/model/project');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelProjectWizard().resetModelFileState(context));
		},
	},
	{
		uuid: '5f58202689734b14961c14951e3d2976',
		name: 'model.project.enableModelTitle',
		execute: async (context) => {
			const importedModule = await import('@libs/model/project');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelProjectWizard().enableModel(context));
		},
	},
	{
		uuid: '6a38848562a74f5fbddce4abc0c831ba',
		name: 'model.project.disableModelTitle',
		execute: async (context) => {
			const importedModule = await import('@libs/model/project');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelProjectWizard().disableModel(context));
		},
	},
	{
		uuid: '19c6a5e037fd4fb09c58a1c1ac0a439c',
		name: 'model.project.deleteModelTitle',
		execute: async (context) => {
			const importedModule = await import('@libs/model/project');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelProjectWizard().deleteCompleteModel(context));
		},
	},
];