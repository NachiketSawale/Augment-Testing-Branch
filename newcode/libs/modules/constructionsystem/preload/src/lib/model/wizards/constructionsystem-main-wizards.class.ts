/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

/**
 * construction system master wizards
 */
export const CONSTRUCTION_SYSTEM_MAIN_WIZARDS: IWizard[] = [
	{
		uuid: '1fadc9e557a84668bdd36ac3362e8fb5',
		name: 'resetInstanceParameters',
		execute: (context) => {
			return import('@libs/constructionsystem/main').then((m) => {
				context.injector.get(m.ConstructionSystemMainResetInstanceParametersWizardService).resetInstanceParameters();
			});
		},
	},
	{
		uuid: '618e6d06c52144969491db27eff0f9ba',
		name: 'apply',
		execute: (context) => {
			return import('@libs/constructionsystem/main').then((m) => {
				context.injector.get(m.ConstructionSystemMainApplyLineItemToEstimateWizardService).apply();
			});
		},
	},
	{
		uuid: '6681b0c639b24afb890e8f69636906df',
		name: 'assignObjectsBySelectionStatement',
		execute: (context) => {
			return import('@libs/constructionsystem/main').then((m) => {
				context.injector.get(m.ConstructionSystemMainWizardService).assignObjectsBySelectionStatement();
			});
		},
	},
	{
		uuid: '28b1132f7bea44f48da1cd82825cbe36',
		name: 'saveAsTemplate',
		execute: (context) => {
			return import('@libs/constructionsystem/main').then((m) => {
				context.injector.get(m.ConstructionSystemMainWizardService).saveAsTemplate();
			});
		},
	},
	{
		uuid: '6655cf34a50c4b6dbddb112310fdf820',
		name: 'createInstance',
		execute: (context) => {
			return import('@libs/constructionsystem/main').then((m) => {
				context.injector.get(m.ConstructionSystemMainCreateInstanceWizardService).createInstance();
			});
		},
	},
	{
		uuid: '0232e6e17d9a447db41bd0d18eb91dbb',
		name: 'runWizard',
		execute: (context) => {
			return import('@libs/constructionsystem/main').then(async (m) => {
				await context.injector.get(m.ConstructionSystemMainBulkAssignmentWizardService).runWizard();
			});
		},
	},
];
