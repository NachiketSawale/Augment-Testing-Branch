/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, IWizard, PlatformModuleManagerService } from '@libs/platform/common';

export const PROCUREMENT_CONTRACT_WIZARDS: IWizard[] = [
	{
		uuid: '64b6dc1d061642b5b4bf088e5d3ffeb3',
		name: 'Change Status',
		description: 'Change Status.',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return m.ProcurementContractChangeStatusWizardService.execute(context);
			});
		},
	},
	{
		uuid: '223b11196da94407ae393291eb483f11',
		name: 'Change Status For Project document',
		description: 'Change Status For Project document.',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((module) => {
				return module.ProcurementContractChangeProjectDocumentStatusWizardService.execute(context);
			});
		},
	},
	{
		uuid: 'd8007b5825b747d8af23eb7f6c339a4c',
		name: 'Change configuration wizard',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractChangeConfigurationWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '00ee6a2d1c9f44ee992c8cac6ed8dcc1',
		name: 'contractTerminate',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractTerminateWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '7c9f4fb2fe004bc79bd4923d6602fadb',
		name: 'changeContractCode',
		execute: async (context: IInitializationContext): Promise<void> => {
			const m = await import('@libs/procurement/contract');
			return context.injector.get(m.ProcurementContractChangeCodeWizardService).changeCode(context);
		},
	},
	{
		uuid: '4675ac1affdd46f98f1bc2a633cc16e1',
		name: 'procurementContractWizardService',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractCreateWicWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'c6545d680f1b4647962b56f64cf69f57',
		name: 'Change Item Status',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractChangeItemStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '0868dd713bc149d69e70de85d0500852',
		name: 'updateMaterial',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractUpdateMaterialWizard).onStartWizard();
			});
		},
	},
	{
		uuid: '67ce23789d8d46dda00d436f4ff41e38',
		name: 'Insert Material',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractInsertMaterialWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'f6bb793bef1194a885df4f38df824b6a',
		name: 'generateTransaction',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractGenerateTransactionWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'e534a4395d434900901e96173638a3d5',
		name: 'exportMaterial',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractExportMaterialWizard).onStartWizard();
			});
		},
	},
	{
		uuid: '93999c1751f246579476776ce1a92c27',
		name: 'changePaymentScheduleStatus',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractChangePaymentScheduleStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '04cf1b2cd29141a1bb7ff885d0ab3f8f',
		name: 'maintainPaymentScheduleVersion',
		execute(context: IInitializationContext): Promise<void> | undefined {
			const currentModule = context.injector.get(PlatformModuleManagerService).activeModule?.internalModuleName;
			if (currentModule === 'sales.contract') {
				return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().maintainPaymentScheduleVersion(context));
			} else {
				return import('@libs/procurement/contract').then((m) => {
					context.injector.get(m.ProcurementContractMaintainPaymentScheduleVersionWizardService).onStartWizard();
				});
			}
		},
	},
	{
		uuid: '72d6de72869649b8b13c9b1c3123de8b',
		name: 'updateFrameWorkMaterialCatalog',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.PrcConUpdateFrameWorkMaterialCatalogWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'c0ce3e30b54e429b9995f8ecdf94f654',
		name: 'updatePaymentScheduleDOC',
		execute(context: IInitializationContext): Promise<void> | undefined {
			const currentModule = context.injector.get(PlatformModuleManagerService).activeModule?.internalModuleName;
			if (currentModule === 'sales.contract') {
				return import('@libs/sales/contract').then((module) => new module.SalesContractMainWizard().updatePaymentScheduleDoc(context));
			} else {
				return import('@libs/procurement/contract').then((m) => {
					context.injector.get(m.ContractUpdatePaymentScheduleDegreeOfCompletionWizardService).onStartWizard();
				});
			}
		},
	},
	{
		uuid: '6db2b9e49b124bed8be55ddf851fc06c',
		name: 'editCallOffPrice',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractEditCallOffsPriceWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'c5433e7bc87f44239d68f54e2b2a0366',
		name: 'Create Pes',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractCreatePesWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '435b57201a4f41e799e0e2f2c93b641e',
		name: 'createWicFromBoq',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.PrcConCreateWicFromBoqWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '5a4fc426e84843fba130f3cb0944fff2',
		name: 'validateAndUpdateItemQuantity',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractValidateAndUpdateItemQuantityWizardService).showDialog();
			});
		},
	},
	{
		uuid: 'cd057daac4584b22affdb7c6274ca7dd',
		name: 'createRequests',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractCreateRequestsWizardService).createRequests();
			});
		},
	},
	{
		uuid: '49d766e311424e2180da755183535bfb',
		name: 'prcItemExcelImport',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/contract').then((m) => {
				return context.injector.get(m.ProcurementContractItemExcelImportWizardService).onStartWizard();
			});
		},
	},
];
