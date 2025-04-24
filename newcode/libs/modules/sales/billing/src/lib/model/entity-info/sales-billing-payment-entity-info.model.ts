/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPaymentEntity } from '@libs/sales/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { SalesBillingLabels } from '../sales-billing-labels.class';
import { SalesCommonLabels } from '@libs/sales/common';
import { SalesBillingPaymentDataService } from '../../services/sales-billing-payment-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Sales Billing Payment entity info
 */
export const SALES_BILLING_PAYMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IPaymentEntity>({
	grid: {
		title: { key: 'sales.billing.containerTitlePayments' },
	},
	form: {
		title: { key: 'sales.billing.containerTitlePaymentDetail' },
		containerUuid: 'da31be78e5cb416db8c44e2b41afa56e',
	},
	dataService: (ctx) => ctx.injector.get(SalesBillingPaymentDataService),
	dtoSchemeId: { moduleSubModule: 'Sales.Billing', typeName: 'PaymentDto' },
	permissionUuid: 'd9cb8c6e6cdb44daa4ef02f6f64fe750',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: [
					'CurrencyFk',
					'ExchangeRate',
					'Amount',
					'DiscountAmount',
					'AmountNet',
					'AmountVat',
					'DiscountAmountVat',
					'TaxCodeFk',
					'PaymentDate',
					'PostingDate',
					'IsRetention',
					'CodeRetention',
					'BankVoucherNo',
					'BankAccount',
					'PostingNarritive',
					'CommentText',
					'AmountOc',
					'AmountVatOc',
					'DiscountAmountOc',
					'DiscountAmountVatOc',
					'DiscountAmountNet',
					'AmountNetOc',
					'DiscountAmountNetOc',
					'IsOverPayment',
					'BankEntryNo',
				],
			},
		],
		labels: {
			...SalesBillingLabels.getSalesBillingLabels(),
			...SalesCommonLabels.getSalesCommonLabels(),
			...prefixAllTranslationKeys('sales.billing.', {
				PaymentDate: {
					key: 'entityPaymentDate',
					text: 'Payment Date',
				},
				DiscountAmountVat: {
					key: 'entityDiscountAmountVat',
					text: 'VAT Discount Amount',
				},
				AmountOc: {
					key: 'entityAmountOc',
					text: 'Amount Oc',
				},
				AmountVatOc: {
					key: 'entityAmountVatOc',
					text: 'VAT Amount Oc',
				},
				DiscountAmountOc: {
					key: 'entityDiscountAmountOc',
					text: 'Discount Amount Oc',
				},
				DiscountAmountVatOc: {
					key: 'entityDiscountAmountVatOc',
					text: 'VAT Discount Amount Oc',
				},
				IsRetention: {
					key: 'entityIsRetention',
					text: 'Is Retention',
				},
				CodeRetention: {
					key: 'entityCodeRetention',
					text: 'Code Retention',
				},
				DiscountAmountNet: {
					key: 'entityDiscountAmountNet',
					text: 'Net Discount Amount',
				},
				DiscountAmountNetOc: {
					key: 'entityDiscountAmountNetOc',
					text: 'Net Discount Amount Oc',
				},
				BankVoucherNo: {
					key: 'entityBankVoucherNo',
					text: 'Bank Voucher No',
				},
				BankAccount: {
					key: 'entityBankAccount',
					text: 'Bank Account',
				},
				PostingNarritive: {
					key: 'entityPostingNarritive',
					text: 'Posting Narrative',
				},
				IsOverPayment: {
					key: 'entityIsOverPayment',
					text: 'Is Over Payment',
				},
				BankEntryNo: {
					key: 'entityBankEntryNo',
					text: 'Bank Entry No.',
				},
			}),
		},
		overloads: {
			TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
			CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(false),
			AmountVat: {
				readonly: true,
			},
			DiscountAmountVat: {
				readonly: true,
			},
			AmountVatOc: {
				readonly: true,
			},
			DiscountAmountVatOc: {
				readonly: true,
			},
		},
	},
});
