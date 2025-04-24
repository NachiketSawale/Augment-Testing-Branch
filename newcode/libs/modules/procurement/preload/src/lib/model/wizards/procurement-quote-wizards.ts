/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, IWizard } from '@libs/platform/common';

export const PROCUREMENT_QUOTE_WIZARDS: IWizard[] = [
	{
		uuid: '9ee2683afcad489db7759d5729115995',
		name: 'changeQuoteStatus',
		execute: async (context) => {
			const module = await import('@libs/procurement/quote');
			return new module.ProcurementQuoteWizard().changeQuoteStatus(context);
		},
	},
	{
		uuid: '6cb200f83e68453588940f62a5d159cd',
		name: 'Change Status For Project document',
		execute: async (context) => {
			const module = await import('@libs/procurement/quote');
			return new module.ProcurementQuoteWizard().changeStatusForProjectDocument(context);
		},
	},
	{
		uuid: 'c8a8844f626c45c0a8f095e1583168c3',
		name: 'Change configuration wizard',
		execute: async (context) => {
			const module = await import('@libs/procurement/quote');
			return new module.ProcurementQuoteWizard().changeProcurementConfiguration(context);
		},
	},
	{
		uuid: 'f0c6d8c3e9134353b7d666b975768844',
		name: 'changeQuoteCode',
		execute: async (context) => {
			const module = await import('@libs/procurement/quote');
			return new module.ProcurementQuoteWizard().changeCode(context);
		},
	},
	{
		uuid: 'a635aa183c23407dbaeea1329afc782e',
		name: 'importMaterial',
		execute: async (context) => {
			const module = await import('@libs/procurement/quote');
			return new module.ProcurementQuoteWizard().importMaterial(context);
		},
	},
	{
		uuid: 'c81a7f1742c94782ba871ab835c116cd',
		name: 'validateAndUpdateItemQuantity',
		execute: async (context) => {
			const module = await import('@libs/procurement/quote');
			return new module.ProcurementQuoteWizard().showDialog(context);
		},
	},
	{
		uuid: 'e40f1327105c42b1afbcac543299246c',
		name: 'qtoExcelImport',
		execute: async (context) => {
			const module = await import('@libs/procurement/quote');
			return new module.ProcurementQuoteWizard().qtoExcelImport(context);
		},
	},
	{
		uuid: '36870396169b44618a70f2d55f7225f4',
		name: 'exportMaterial',
		execute: async (context) => {
			const module = await import('@libs/procurement/quote');
			return new module.ProcurementQuoteWizard().exportMaterial(context);
		},
	},
	//Todo: The following line of code will be removed once we have a provision for the UUID '8ce7655b8232447386ba0dcf8bcb3568' to load the prc.quote module wizard.
	{
		uuid: '8ce7655b8232447386ba0dcf8bcb3568',
		name: 'Update item price wizard',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/quote').then((m) => {
				return context.injector.get(m.ProcurementQuoteUpdateItemPriceWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '0e863ead7a404025a4ecf33e70d32fe1',
		name: 'increaseVersion',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/quote').then((m) => {
				return context.injector.get(m.ProcurementQuoteIncreaseVersionWizardService).increaseVersion();
			});
		},
	},
];
