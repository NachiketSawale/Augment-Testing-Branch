/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ITranslatable, prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IInvHeader2InvHeaderEntity } from '../../model';
import { ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceChainedInvoiceLayoutService {
	public async generateLayout(): Promise<ILayoutConfiguration<IInvHeader2InvHeaderEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['InvHeaderChainedFk', 'InvHeaderChainedProgressId'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.invoice.', {
					InvHeaderChainedFk: {
						key: 'header.code',
						text: 'Entry No',
					},
					InvHeaderChainedProgressId: {
						key: 'header.progressid',
						text: 'Progress Invoice',
					},
				}),
			},

			overloads: {
				InvHeaderChainedFk: {
					... ProcurementSharedLookupOverloadProvider.provideInventoryHeaderChainedLookupOverload(true, {
						key: 'prc-invoice-header-filter',
						execute: (context) => {
							return {
								IsCanceled: false,
								Id: context.entity!.Id,
								BusinessPartnerFk: context.entity!.InvHeaderEntity!.BusinessPartnerFk,
								ConHeaderFk: context.entity!.InvHeaderEntity!.ConHeaderFk,
							};
						},
					}),
					...{	additionalFields: [
						this.createAdditionalFields('Narrative', 'Description', { text: 'Narrative', key: 'procurement.invoice.header.description' }),
						this.createAdditionalFields('Status', 'StatusDescriptionInfo.Translated', { text: 'Status', key: 'cloud.common.entityStatus' }),
						this.createAdditionalFields('Date', 'DateInvoiced', { text: 'Date', key: 'procurement.invoice.header.dateInvoiced' }),
						this.createAdditionalFields('Reference', 'Reference', { text: 'Invoice No.', key: 'procurement.invoice.header.reference' }),
						this.createAdditionalFields('Received', 'DateReceived', { text: 'Date Received', key: 'procurement.invoice.header.dateReceived' }),
						this.createAdditionalFields('Type', 'TypeDescriptionInfo.Translated', { text: 'Type', key: 'cloud.common.entityType' }),
						this.createAdditionalFields('NetTotal', 'NetTotal', { text: 'Net Total', key: 'procurement.invoice.header.netTotal' }),
						this.createAdditionalFields('Period', 'Period', { text: 'Period', key: 'procurement.invoice.header.period' }),
						this.createAdditionalFields('NetTotalOc', 'NetTotalOc', { text: '"Total(Net OC)', key: 'procurement.invoice.header.netTotalOc' }),
						this.createAdditionalFields('PeriodOc', 'PeriodOc', { text: 'Period OC', key: 'procurement.invoice.header.periodOc' }),
						this.createAdditionalFields('AmountNetPes', 'AmountNetPes', { text: 'PES(NET)', key: 'procurement.invoice.header.amountNetPES' }),
						this.createAdditionalFields('AmountNetPesOc', 'AmountNetPesOc', { text: 'PES(NET OC)', key: 'procurement.invoice.header.amountNetPESOc' }),
						this.createAdditionalFields('AmountVatPes', 'AmountVatPes', { text: 'PES(VAT)', key: 'procurement.invoice.header.amountVatPES' }),
						this.createAdditionalFields('AmountVatPesOc', 'AmountVatPesOc', { text: 'PES(VAT OC)', key: 'procurement.invoice.header.amountVatPESOc' }),
						this.createAdditionalFields('AmountNetContract', 'AmountNetContract', { text: 'Contract(NET)', key: 'procurement.invoice.header.amountNetContract' }),
						this.createAdditionalFields('AmountNetContractOc', 'AmountNetContractOc', { text: 'Contract(NET OC)', key: 'procurement.invoice.header.amountNetContractOc' }),
						this.createAdditionalFields('AmountVatContract', 'AmountVatContract', { text: 'Contract(VAT)', key: 'procurement.invoice.header.amountVatContract' }),
						this.createAdditionalFields('AmountVatContractOc', 'AmountVatContractOc', { text: 'Contract(VAT OC)', key: 'procurement.invoice.header.amountVatContractOc' }),
						this.createAdditionalFields('AmountNetOther', 'AmountNetOther', { text: 'Other(NET)', key: 'procurement.invoice.header.amountNetOther' }),
						this.createAdditionalFields('AmountNetOtherOc', 'AmountNetOtherOc', { text: 'Other(NET OC)', key: 'procurement.invoice.header.amountNetOtherOc' }),
						this.createAdditionalFields('AmountVatOther', 'AmountVatOther', { text: 'Other(VAT)', key: 'procurement.invoice.header.amountVatOther' }),
						this.createAdditionalFields('AmountVatOtherOc', 'AmountVatOtherOc', { text: 'Other(VAT OC)', key: 'procurement.invoice.header.amountVatOtherOc' }),
						this.createAdditionalFields('AmountNetReject', 'AmountNetReject', { text: 'Reject(NET)', key: 'procurement.invoice.header.amountNetReject' }),
						this.createAdditionalFields('AmountNetRejectOc', 'AmountNetRejectOc', { text: 'Reject(NET OC)', key: 'procurement.invoice.header.amountNetRejectOc' }),
						this.createAdditionalFields('AmountVatReject', 'AmountVatReject', { text: 'Reject(VAT)', key: 'procurement.invoice.header.amountVatReject' }),
						this.createAdditionalFields('AmountVatRejectOc', 'AmountVatRejectOc', { text: 'Reject(VAT OC)', key: 'procurement.invoice.header.amountVatRejectOc' }),
					],}
				},
			},
			transientFields: [
				{
					id: 'InvHeaderChainedProgressId',
					readonly: true,
					model: 'InvHeaderChainedProgressId',
					type: FieldType.Description,
				},
			],
		};
	}

	private createAdditionalFields(id: string, displayMember: string, label: ITranslatable) {
		return {
			id: id,
			displayMember: displayMember,
			label: label,
			column: true,
			singleRow: true,
			row: true,
		};
	}
}
