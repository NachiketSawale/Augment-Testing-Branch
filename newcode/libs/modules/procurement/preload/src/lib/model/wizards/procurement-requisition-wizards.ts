/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, IWizard } from '@libs/platform/common';

export const PROCUREMENT_REQUISITION_WIZARDS: IWizard[] = [
	{
		uuid: '73183dadb1cc42de86e5096fcaa104d9',
		name: 'changeRequisitionStatus',
		execute: async (context) => {
			const module = await import('@libs/procurement/requisition');
			return new module.ProcurementRequisitionWizard().changeRequisitionStatus(context);
		},
	},
	{
		uuid: '265f575b21f44cf795d9981726ca2c4e',
		name: 'Copy Requisition',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.CopyRequisitionService).copyRequisition();
			});
		},
	},
	{
		uuid: '98ff979b631148ff95c7ab219cea64fb',
		name: 'Create Business Partner',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return new m.ProcurementRequisitionCreateBusinesspersonWizard(context).createBusinessPartner();
			});
		},
	},
	{
		uuid: 'ffa3e8aa383b4545bb009e21bde4e093',
		name: 'Change Status For Project document',
		execute: async (context) => {
			const module = await import('@libs/procurement/requisition');
			return new module.ProcurementRequisitionWizard().changeStatusForProjectDocument(context);
		},
	},
	{
		uuid: 'b2362beaf55143da854de65183c96008',
		name: 'createRfq',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementRequisitionCreateRfqWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '00e73ba3c4ff4a0ea3937e0a3a23557e',
		name: 'changeRequisitionCode',
		execute(context: IInitializationContext) {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementRequisitionChangeCodeWizardService).changeCode(context);
			});
		},
	},
	{
		uuid: 'd720f84b4f3b4e6c8857114579f4b87c',
		name: 'Change Item Status',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementRequisitionChangeItemStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '8fbbd3a6337640a89a1535ec55704f96',
		name: 'changePaymentScheduleStatus',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementRequisitionChangePaymentScheduleStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: 'f477bae385fb4ecb88e159fb741d2e95',
		name: 'changeProcurementConfiguration',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementRequisitionChangeConfigurationWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '12f9d13b74d54c438dc7cc660743141e',
		name: 'showEditor',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return new m.ProcurementRequisitionWizard().characteristicBulkEditor(context);
			});
		},
	},
	{
		uuid: '9d4e158abd704ee5a7c2f5f785f7c154',
		name: 'validateAndUpdateItemQuantity',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementRequisitionValidateAndUpdateItemQuantityWizardService).showDialog();
			});
		},
	},
	{
		uuid: 'da93f00c36254d2b8894ebcae6eb8ecc',
		name: 'generateItemDeliverySchedule',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementRequisitionGenerateDeliveryScheduleWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '4f82fc6e659c463f9376aa590e5b83f5',
		name: 'prcItemExcelImport',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementPackageItemExcelImportWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '07935f935d7c47ed924047ae542c2743',
		name: 'exportMaterial',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementRequisitionExportMaterialWizardService).export();
			});
		},
	},
	{
		uuid: '768fa25553964048a02506ef8633c753',
		name: 'createContract',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/requisition').then((m) => {
				return context.injector.get(m.ProcurementReqCreateContractWizardService).createContractByReq();
			});
		},
	},
];
