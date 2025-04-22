/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvPaymentEntity } from '../model';
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';

/**
 * Procurement payment layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoicePaymentLayoutService {
	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IInvPaymentEntity>> {
		return <ILayoutConfiguration<IInvPaymentEntity>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'Amount_Net',
						'DiscountAmountNet',
						'PaymentDate',
						'PostingDate',
						'Amount',
						'DiscountAmount',
						'IsRetention',
						'BankVoucherNo',
						'BankAccount',
						'PostingNarritive',
						'CommentText',
						'AmountVat',
						'DiscountAmountVat',
						'TaxCodeFk',
						'CodeRetention',
						'IsOverPayment',
						'BankEntryNo',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.invoice.', {
					Amount_Net: {
						key: 'entityAmountNet',
						text: 'Net Amount',
					},
					DiscountAmountNet: {
						key: 'entityDiscountAmountNet',
						text: 'Net Discount Amount',
					},
					PaymentDate: {
						key: 'paymentDate',
						text: 'Payment Date',
					},
					PostingDate: {
						key: 'transaction.postingDate',
						text: 'Posting Date',
					},
					Amount: {
						key: 'transaction.amount',
						text: 'Amount',
					},
					DiscountAmount: {
						key: 'header.discountAmount',
						text: 'Discount Amount',
					},
					IsRetention: {
						key: 'isRetention',
						text: 'Is Retention',
					},
					BankVoucherNo: {
						key: 'bankVoucherNo',
						text: 'Bank voucher No.',
					},
					BankAccount: {
						key: 'bankAccount',
						text: 'Bank Account',
					},
					PostingNarritive: {
						key: 'transaction.postingNarritive',
						text: 'Posting Narrative',
					},
					AmountVat: {
						key: 'entityAmountVat',
						text: 'VAT Amount',
					},
					DiscountAmountVat: {
						key: 'entityDiscountAmountVat',
						text: 'VAT Discount Amount',
					},
					CodeRetention: {
						key: 'header.codeRetention',
						text: 'Code Retention',
					},
					IsOverPayment: {
						key: 'entityIsOverPayment',
						text: 'Is Over Payment',
					},
					BankEntryNo: {
						key: 'bankEntryNo',
						text: 'Bank Entry No.',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {
						key: 'entityCommentText',
						text: 'Comment',
					},
					TaxCodeFk: {
						key: 'entityTaxCode',
						text: 'Tax Code',
					},
				}),
			},
			overloads: {
				AmountVat: {
					readonly: true,
				},
				DiscountAmountVat: {
					readonly: true,
				},
				BankEntryNo: {
					readonly: true,
				},
				TaxCodeFk: ProcurementSharedLookupOverloadProvider.provideTaxCodeLookupOverload(true, 'Code'),
			},
		};
	}
}
