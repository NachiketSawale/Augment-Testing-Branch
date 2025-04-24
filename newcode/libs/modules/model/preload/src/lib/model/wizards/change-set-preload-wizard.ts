/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents wizards of Model ChangeSet
 */

import { IWizard, PlatformModuleManagerService } from '@libs/platform/common';

export const MODEL_CHANGESET_WIZARD : IWizard[] = [
	{
		uuid: 'e702b7eaf43f44468227cd324b7a7202',
		name: 'model.changeset.changeSetWizard.createTitle',
		execute: async (context) => {
			const importedModule = await import('@libs/model/changeset');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelChangeSetWizard().compareModels(context));
		},
	},{
		uuid: 'a5055dd5bfbe4e05ad7891cdc17f6b39',
		name: 'model.changeset.recompare',
		execute: async (context) => {
			const importedModule = await import('@libs/model/changeset');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelChangeSetWizard().recompareModels(context));
		},
	}   
];