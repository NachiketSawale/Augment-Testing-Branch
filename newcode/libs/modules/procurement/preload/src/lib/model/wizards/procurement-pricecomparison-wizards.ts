/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, IWizard } from '@libs/platform/common';

export const PROCUREMENT_PRICECOMPARISION_WIZARDS: IWizard[] = [
	{
		uuid: '3283f5e5635b4c8f9f0f8a0c2cacc81f',
		name: 'exportExcel',
		execute: async (context): Promise<void> => {
			const m = await import('@libs/procurement/pricecomparison');
			await context.injector.get(m.ProcurementPricecomparisonCompareWizardService).exportExcel();
		},
	},
	{
		uuid: '8890f23ec30c4a9a8f4c638c0a2694aa',
		name: 'createContract',
		execute: async (context): Promise<void> => {
			const m = await import('@libs/procurement/pricecomparison');
			await context.injector.get(m.ProcurementPricecomparisonCompareWizardService).createContract();
		},
	},
	{
		uuid: 'dae6ceaf9f1545b39c95a47c0120eef9',
		name: 'exportMaterial',
		execute: async (context: IInitializationContext): Promise<void> => {
			const m = await import('@libs/procurement/pricecomparison');
			await context.injector.get(m.ProcurementPriceComparisonExportMaterialWizardService).exportMaterial();
		},
	},
	{
		uuid: 'babfbe6284b848659ad3b0d01f7ad1bf',
		name: 'itemEvaluation',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/pricecomparison').then((m) => {
				return context.injector.get(m.SetAdHocPriceWizardService).onStartWizard();
			});
		},
	},
];
