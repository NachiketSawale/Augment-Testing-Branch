/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IInvRejectEntity } from '../../model';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceRejectionLayoutService {
	private readonly leadingService = inject(ProcurementInvoiceHeaderDataService);

	//private readonly invRejctionService = inject(ProcurementInvoiceHeaderDataService);

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IInvRejectEntity>> {
		return {
			groups: [
				{
					gid: 'invoiceService',
					title: {
						key: 'procurement.invoice.group.service',
						text: 'Service',
					},
					attributes: [
						'Quantity',
						'InvRejectionReasonFk',
						'UomFk',
						'AmountNet',
						'AmountNetOc',
						'AmountTotal',
						'AmountTotalOc',
						'Description',
						'QuantityAskedFor',
						'QuantityConfirmed',
						'PriceAskedForOc',
						'PriceConfirmedOc',
						'Itemreference',
						'AskedForTotal',
						'ConfirmedTotal',
						'NetTotal',
						'PriceAskedFor',
						'PriceConfirmed',
						'AskedForTotalOc',
						'ConfirmedTotalOc',
						'NetTotalOc',
						'InvRejectFk',
						'ControllinggrpsetFk',
						'MdcSalesTaxGroupFk',
					],
				},
				{
					gid: 'invoiceOther',
					title: {
						key: 'procurement.invoice.group.other',
						text: 'Other',
					},
					attributes: ['TaxCodeFk', 'CommentText', 'Remark'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Quantity: {
						key: 'entityQuantity',
						text: 'Quantity',
					},
					UomFk: {
						key: 'entityUoM',
						text: 'Uom',
					},
					Remark: {
						key: 'entityRemark',
						text: 'Remark',
					},
					ControllinggrpsetFk: {
						key: 'entityControllinggrpset',
						text: 'Controlling grp set',
					},
					TaxCodeFk: {
						key: 'entityTaxCode',
						text: 'Tax Code',
					},
					CommentText: {
						key: 'entityComment',
						text: 'Comment',
					},
				}),
				...prefixAllTranslationKeys('procurement.invoice.', {
					InvRejectionReasonFk: {
						key: 'entityRejection',
						text: 'reason',
					},
					QuantityAskedFor: {
						key: 'entityQuantityAskedFor',
						text: 'Quantity Asked For',
					},
					QuantityConfirmed: {
						key: 'entityQuantityConfirmed',
						text: 'Quantity Confirmed',
					},
					PriceAskedFor: {
						key: 'entityPriceAskedfor',
						text: 'Price(Asked for)',
					},
					PriceConfirmed: {
						key: 'entityPriceConfirmed',
						text: 'Price(Confirmed)',
					},
					PriceAskedForOc: {
						key: 'entityPriceAskedforOc',
						text: 'Price(Asked For OC)',
					},
					PriceConfirmedOc: {
						key: 'entityPriceConfirmedOc',
						text: 'Price(Confirmed OC)',
					},
					Itemreference: {
						key: 'entityItemreference',
						text: 'Item reference',
					},
					AskedForTotal: {
						key: 'askedForTotal',
						text: 'Total(Asked For)',
					},
					ConfirmedTotal: {
						key: 'confirmedTotal',
						text: 'Total(Confirmed)',
					},
					NetTotal: {
						key: 'netTotal',
						text: 'Total(Net)',
					},
					AskedForTotalOc: {
						key: 'askedForTotalOc',
						text: 'Total(Asked For OC)',
					},
					ConfirmedTotalOc: {
						key: 'confirmedTotalOc',
						text: 'Total(Confirmed OC)',
					},
					NetTotalOc: {
						key: 'netTotalOc',
						text: 'Total(Net OC)',
					},
					InvRejectFk: {
						key: 'view.rejection',
						text: 'Rejection',
					},
					AmountNet: {
						key: 'amountUnit',
						text: 'Amount(Unit)',
					},
					AmountNetOc: {
						key: 'amountUnitOc',
						text: 'Amount(Unit OC)',
					},
					AmountTotal: {
						key: 'amountTotal',
						text: 'Amount(Total)',
					},
					AmountTotalOc:{
						key: 'amountTotalOc',
						text: 'Amount(Total OC)',
					},
					MdcSalesTaxGroupFk: {
						key: 'entityMdcSalesTaxGroup',
						text: 'Sales Tax Group',
					},
				}),
			},
			overloads: {
				// Code: {
				// 	readonly: true,
				// },
				AmountTotal: {
					readonly: true,
				},
				AmountTotalOc: {
					readonly: true,
				},
				AskedForTotal: {
					readonly: true,
				},
				ConfirmedTotal: {
					readonly: true,
				},
				AskedForTotalOc: {
					readonly: true,
				},
				ConfirmedTotalOc: {
					readonly: true,
				},
				InvRejectionReasonFk: BasicsSharedCustomizeLookupOverloadProvider.provideInvRejectionReasonLookupOverload(false),
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(false), 
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				InvRejectFk: ProcurementSharedLookupOverloadProvider.provideInvoiceRejectionLookupOverload(), 
				ControllinggrpsetFk: {
					readonly: true,
					form: {
						visible: false,
					},
					grid: {
						// Todo - custom formatter controllingStructureGrpSetDTLActionProcessor
						// wait for framework: https://rib-40.atlassian.net/browse/DEV-19395
					},
				},
				MdcSalesTaxGroupFk: ProcurementSharedLookupOverloadProvider.provideProcurementSalesTaxGroupLookupOverload(true),
			},
		};
	}
}
