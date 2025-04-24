/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, IWizard } from '@libs/platform/common';
export const PROCUREMENT_PES_WIZARDS: IWizard[] = [
	{
		uuid: 'dc502d4ddce94e778605377250053bdc',
		name: 'Change configuration wizard',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesChangeConfigurationWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '5d10029e6a6947caa6207b6f91f0e14a',
		name: 'update quantity wizard',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesUpdateQuantityWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'c4bc7bbda6be430f8fbd607aaa02b820',
		name: 'createInvoice',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesCreateInvoiceWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'edf9d1e5bb0147e98e2d8a52bf44210f',
		name: 'update contract tax code wizard',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesUpdateContractTaxCodeWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '9f7870c1cd524b9499a88ef7890a2239',
		name: 'changePesCode',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesChangePesCodeWizardService).changeCode(context);
			});
		},
	},
	{
		uuid: 'b6714ef14f61412392f9361c2cff79ad',
		name: 'editItemPrice',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesEditItemPriceWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '3b4102b88a177bdb6b1983b401ebbfc1',
		name: 'generateTransaction',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesGenerateTransactionWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '040b48cf1c1048eb8c610b96b1669d01',
		name: 'createTransaction',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesCreateAccrualTransactionWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '7143b60f28a642eaae7f8acac57d2b2e',
		name: 'changeSelfBillingStatus',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesChangeSelfBillingStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '397a4360629c4a098b131a751ad9e46d',
		name: 'procurementPesWizardService',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesCreateChangeOrderWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '9b77b8ca1a7044278a3e84fd95b8e2af',
		name: 'changePesStatus',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesChangeStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: '71431bef70014b51b986e955d09c871e',
		name: 'pesItemExcelImport',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementQuoteExcelImportWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '7b01d23693a6429fac42ee96245e8967',
		name: 'changeItemProjectChangeStatus',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/pes').then((m) => {
				return context.injector.get(m.ProcurementPesPrcItemProjectChangeStatusWizardService).startChangePesItemProjectChangeStatusWizard();
			});
		},
	},
];
