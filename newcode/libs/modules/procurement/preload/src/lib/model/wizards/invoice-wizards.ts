/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, IWizard } from '@libs/platform/common';

export const PROCUREMENT_INVOICE_WIZARDS: IWizard[] = [
	{
		uuid: 'bf121a948ce84727a09dc24c44fa5fb2',
		name: 'importXInvoice',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return context.injector.get(m.ProcurementInvoiceImportXInvoiceWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '6bfc42be60cf4609b7bd49241e8620ca',
		name: 'changeInvoiceStatus',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return context.injector.get(m.ChangeProcurementInvoiceStatusWizardService).onStartChangeStatusWizard();
			});
		},
	},
	{
		uuid: 'a9684f1e49f949118c739699723787bb',
		name: 'prepareTransaction',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return context.injector.get(m.ProcurementInvoicePrepareSelectionTransactionWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '02e8536a4f4c421ebf745c47a2cc9144',
		name: 'importInvoice',
		execute: async (context: IInitializationContext) => {
			const m = await import('@libs/procurement/invoice');
			await context.injector.get(m.ProcurementInvoiceImportInvoiceWizardService).onStartWizard();
		},
	},
	{
		uuid: 'ffa084af1e144161b881781652d598e5',
		name: 'Change Status For Project document',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return m.ProcurementInvoiceChangeProjectDocumentStatusWizardService.execute(context);
			});
		},
	},
	{
		uuid: '2271ce3b69964321828ca0c6c201f312',
		name: 'createAccrualTransaction',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return context.injector.get(m.ProcurementInvoiceCreateAccrualTransactionWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '2712084cd8154116a92182130659ee4e',
		name: 'Change configuration wizard',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return context.injector.get(m.ProcurementInvoiceChangeConfigurationWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: 'b97e0cc20bf648dd89786027260d4af6',
		name: 'create InterCompany Bill wizard',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return context.injector.get(m.ProcurementInvoiceCreateInterCompanyBillWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '5836a150cbc44fea866796252e31a0a7',
		name: 'changeInvoiceCode',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return context.injector.get(m.ProcurementInvoiceChangeCodeWizardService).changeCode(context);
			});
		},
	},
	{
		uuid: '7f778f251821476195b3afca4dc42a46',
		name: 'createRequests',
		execute(context: IInitializationContext): Promise<void> | undefined {
			return import('@libs/procurement/invoice').then((m) => {
				return context.injector.get(m.ProcurementInvoiceCreateRequestsWizardService).createRequests();
			});
		},
	},
];
