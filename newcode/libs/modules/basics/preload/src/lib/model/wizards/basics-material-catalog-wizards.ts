/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const BASICS_MATERIAL_CATALOG_WIZARDS: IWizard[] = [
	{
		uuid: '5C0D377ED48542B7B60505846ACCDC43',
		name: 'enableRecord',
		execute: async (context) => {
			const module = await import('@libs/basics/materialcatalog');
			return new module.BasicsMaterialCatalogWizard().enableWizard(context);
		},
	},
	{
		//TODO: seems currently the uuid is case sensitive.
		uuid: 'D159C643127049EC98D3E29DE633579B',
		name: 'updateDiscount',
		execute: async (context) => {
			const module = await import('@libs/basics/materialcatalog');
			return context.injector.get(module.UpdateDiscountWizardService).start();
		},
	},
	{
		uuid: '451836DA793347B3BC479DE9422D2797',
		name: 'disableRecord',
		execute: async (context) => {
			const module = await import('@libs/basics/materialcatalog');
			return context.injector.get(module.MaterialCatalogDisableWizard).onStartDisableWizard();
		},
	},
	{
		uuid: '687850b694344faa846f44fa2941261f',
		name: 'changeStatusForProjectDocument',
		execute: async (context) => {
			const module = await import('@libs/basics/materialcatalog');
			return context.injector.get(module.MaterialCatalogChangeProjectDocumentStatusWizardService).onStartChangeStatusWizard();
		},
	},
];
