/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents wizards of Model Map
 */

import { IWizard, PlatformModuleManagerService } from '@libs/platform/common';

export const MODEL_MAP_WIZARD : IWizard[] = [
	{
		uuid: 'e7db52fdebdf4a96b962a07e15d32cc0',
		name: 'mmodel.map.level.spacedWizard.generateSpacedLevels',
		execute: async (context) => {
			const importedModule = await import('@libs/model/map');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelMapWizard().showDialogSpaceLevel(context));
		},
	},{
		uuid: '3d07cfaab89f4f6cad57341395337cf8',
		name: 'model.map.populateMapsFromLocationTreeWizard.title',
		execute: async (context) => {
			const importedModule = await import('@libs/model/map');
			const platformModuleManagerService = context.injector.get(PlatformModuleManagerService);
			await platformModuleManagerService.initializeModule(importedModule);
			return context.injector.get(new importedModule.ModelMapWizard().showDialogLocationTree(context));
		},
	}   
];