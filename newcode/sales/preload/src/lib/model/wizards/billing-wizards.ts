/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, IWizard } from '@libs/platform/common';

export const SALES_BILLING_WIZARDS: IWizard[] = [
    {
        uuid: 'dabafbe9ed25475e8a1042f15987c3cf',
        name: { key: 'sales.billing.createConsecutiveBillNoWizardTitle', 'text': 'Create Consecutive Bill Number' },
        execute: (context) => {
            return import('@libs/sales/billing').then((module) =>
                context.injector.get(module.SalesBillingCreateConsecutiveBillNoWizardService).showDialog()
            );
        }
    },
    {
        uuid: 'df04a23b847f46a9ad9e9d174dbe7c80',
        name: 'changeBillStatus',
        execute(context: IInitializationContext) {
            return import('@libs/sales/billing').then((m) => {
                context.injector.get(m.SalesBillingChangeBillStatusWizardService).onStartChangeStatusWizard();
            });
        },
    },
    {
        uuid: 'd98d93b8448b4346857d9a5479db98e1',
        name: 'setPreviousBill',
        async execute(context: IInitializationContext) {
            const m = await import('@libs/sales/billing');
            context.injector.get(m.SalesBillingSetPreviousBillWizardService).showDialog();
        },
    },
    {
        uuid: '68f639053d854cc1a029f92286462f9d',
        name: 'changeCode',
        execute(context: IInitializationContext) {
            return import('@libs/sales/billing').then((m) => {
                context.injector.get(m.SalesBillingChangeBillNoWizardService).changeBillNo();
            });
        },
    },
    {
        uuid: '2d7061fd91824ae5900ae4ddf5331eb1',
        name: 'prepareTransaction',
        execute(context: IInitializationContext) {
            return import('@libs/sales/billing').then((m) => {
                context.injector.get(m.SalesBillingPrepareTransactionWizardService).prepareTransaction();
            });
        },
    },
    {
        uuid: '5a36eea7fc534b1cafd93e8e59487ec7',
        name: 'prepareTransactionForAll',
        execute(context: IInitializationContext) {
            return import('@libs/sales/billing').then((m) => {
                context.injector.get(m.SalesBillingPrepareTransactionForAllWizardService).prepareTransactionForAll();
            });
        },
    },
	 {
			uuid: '9db62f61a03642b7b8fc0437a0542a0f',
			name: 'changeStatusForProjectDocument',
			async execute(context: IInitializationContext) {
				const m = await import('@libs/sales/billing');
				m.SalesBillingChangeStatusForProjectDocumentWizardService.execute(context);
			},
	 }

];
