/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, IWizard } from '@libs/platform/common';
export const PROCUREMENT_STOCK_WIZARDS: IWizard[] = [
	{
		uuid: '8d718dd09ebe4aed88af9ea2e8bd4b4f',
		name: 'createAccrualTransaction',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/stock').then((m) => {
				return context.injector.get(m.ProcurementStockCreateAccrualTransactionWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '2cd0b934ad0e4cbdbd760f82a31a0686',
		name: 'ClearProjectStock',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/stock').then((m) => {
				return context.injector.get(m.ProcurementStockClearProjectStockWizardService).onStartWizard();
			});
		},
	},
	{
		uuid: '2d69a3c1ef3347498d697685bc88c584',
		name: 'CreateOrderProposal',
		execute(context: IInitializationContext):Promise<void> | undefined {
			return import('@libs/procurement/stock').then((m) => {
				return context.injector.get(m.ProcurementStockCreateOrderProposalWizardService).onStartWizard();
			});
		},
	},
];