/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { PrcInvoiceStatusLookupService } from '../lookup-services/invoice-status-lookup.service';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IInvoiceHeaderLookUpEntity {
	Id: number;
	Code: string;
	Description: string;
	TypeDescriptionInfo?: IDescriptionInfo | null;
	InvStatusFk: number;
	DateInvoiced?: Date | null;
	Reference?: string;
	DateReceived?: Date | null;
	Type?: number | null;
	NetTotal?: number | null;
	Period?: number | null;
	NetTotalOc?: number | null;
	PeriodOc?: number | null;
	AmountNetPes?: number | null;
	AmountNetPesOc?: number | null;
	AmountVatPes?: number | null;
	AmountVatPesOc?: number | null;
	AmountNetContract?: number | null;
	AmountNetContractOc?: number | null;
	AmountVatContract?: number | null;
	AmountVatContractOc?: number | null;
	AmountNetOther?: number | null;
	AmountNetOtherOc?: number | null;
	AmountVatOther?: number | null;
	AmountVatOtherOc?: number | null;
	AmountNetReject?: number | null;
	AmountNetRejectOc?: number | null;
	AmountGross: number;
	AmountNet: number;
	AmountVatReject?: number | null;
	AmountVatRejectOc?: number | null;
	TotalPerformedNet: number;
	TotalPerformedGross: number;
	IsCanceled: boolean;
	IsVirtual: boolean;
	IsReadonly: boolean;
	Icon:number;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementShareInvoiceLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IInvoiceHeaderLookUpEntity, TEntity> {
	public constructor() {
		super('InvHeaderChained', {
			uuid: '47727c138dc24add9d555718c073aa57',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'status',
						model: 'StatusDescriptionInfo.Translated',
						type: FieldType.Lookup,
						label: 'cloud.common.entityStatus',
						sortable: true,
						visible: true,
						readonly: true,
						lookupOptions: createLookup({
							dataServiceToken: PrcInvoiceStatusLookupService,
						}),
					},
					{
						id: 'dateInvoiced',
						model: 'DateInvoiced',
						type: FieldType.Date,
						label: { text: 'Date', key: 'procurement.invoice.header.dateInvoiced' },
						sortable: true,
					},
					{
						id: 'reference',
						model: 'Reference',
						type: FieldType.Text,
						label: { text: 'Reference', key: 'procurement.invoice.header.reference' },
						sortable: true,
					},
					{
						id: 'dateReceived',
						model: 'DateReceived',
						type: FieldType.Date,
						label: { text: 'Received', key: 'procurement.invoice.header.dateReceived' },
						sortable: true,
					},
					{
						id: 'type',
						model: 'TypeDescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Type', key: 'cloud.common.entityType' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'netTotal',
						model: 'NetTotal',
						type: FieldType.Decimal,
						label: { text: 'Net Total', key: 'procurement.invoice.header.netTotal' },
						sortable: true,
					},
					{
						id: 'period',
						model: 'Period',
						type: FieldType.Decimal,
						label: { text: 'Period', key: 'procurement.invoice.header.period' },
						sortable: true,
					},
					{
						id: 'netTotalOc',
						model: 'NetTotalOc',
						type: FieldType.Decimal,
						label: { text: 'NetTotalOc', key: 'procurement.invoice.header.netTotalOc' },
						sortable: true,
					},
					{
						id: 'periodOc',
						model: 'PeriodOc',
						type: FieldType.Decimal,
						label: { text: 'PeriodOc', key: 'procurement.invoice.header.periodOc' },
						sortable: true,
					},
					{
						id: 'amountNetPes',
						model: 'AmountNetPes',
						type: FieldType.Decimal,
						label: { text: 'AmountNetPes', key: 'procurement.invoice.header.amountNetPES' },
						sortable: true,
					},
					{
						id: 'amountNetPesOc',
						model: 'AmountNetPesOc',
						type: FieldType.Decimal,
						label: { text: 'AmountNetPesOc', key: 'procurement.invoice.header.amountNetPESOc' },
						sortable: true,
					},
					{
						id: 'amountVatPes',
						model: 'AmountVatPes',
						type: FieldType.Decimal,
						label: { text: 'AmountVatPes', key: 'procurement.invoice.header.amountVatPES' },
						sortable: true,
					},
					{
						id: 'amountVatPesOc',
						model: 'AmountVatPesOc',
						type: FieldType.Decimal,
						label: { text: 'AmountVatPesOc', key: 'procurement.invoice.header.amountVatPESOc' },
						sortable: true,
					},
					{
						id: 'amountNetContract',
						model: 'AmountNetContract',
						type: FieldType.Decimal,
						label: { text: 'AmountNetContract', key: 'procurement.invoice.header.amountNetContract' },
						sortable: true,
					},
					{
						id: 'amountNetContractOc',
						model: 'AmountNetContractOc',
						type: FieldType.Decimal,
						label: { text: 'AmountNetContractOc', key: 'procurement.invoice.header.amountNetContractOc' },
						sortable: true,
					},
					{
						id: 'amountVatContract',
						model: 'AmountVatContract',
						type: FieldType.Decimal,
						label: { text: 'AmountVatContract', key: 'procurement.invoice.header.amountVatContract' },
						sortable: true,
					},
					{
						id: 'amountVatContractOc',
						model: 'AmountVatContractOc',
						type: FieldType.Decimal,
						label: { text: 'AmountVatContractOc', key: 'procurement.invoice.header.amountVatContractOc' },
						sortable: true,
					},
					{
						id: 'amountNetOther',
						model: 'AmountNetOther',
						type: FieldType.Decimal,
						label: { text: 'AmountNetOther', key: 'procurement.invoice.header.amountNetOther' },
						sortable: true,
					},
					{
						id: 'amountNetOtherOc',
						model: 'AmountNetOtherOc',
						type: FieldType.Decimal,
						label: { text: 'AmountNetOtherOc', key: 'procurement.invoice.header.amountNetOtherOc' },
						sortable: true,
					},
					{
						id: 'amountVatOther',
						model: 'AmountVatOther',
						type: FieldType.Decimal,
						label: { text: 'AmountVatOther', key: 'procurement.invoice.header.amountVatOther' },
						sortable: true,
					},
					{
						id: 'amountVatOtherOc',
						model: 'AmountVatOtherOc',
						type: FieldType.Decimal,
						label: { text: 'AmountVatOtherOc', key: 'procurement.invoice.header.amountVatOtherOc' },
						sortable: true,
					},
					{
						id: 'amountNetReject',
						model: 'AmountNetReject',
						type: FieldType.Decimal,
						label: { text: 'AmountNetReject', key: 'procurement.invoice.header.amountNetReject' },
						sortable: true,
					},
					{
						id: 'amountNetRejectOc',
						model: 'AmountNetRejectOc',
						type: FieldType.Decimal,
						label: { text: 'AmountNetRejectOc', key: 'procurement.invoice.header.amountNetRejectOc' },
						sortable: true,
					},
					{
						id: 'amountVatReject',
						model: 'AmountVatReject',
						type: FieldType.Decimal,
						label: { text: 'AmountVatReject', key: 'procurement.invoice.header.amountVatReject' },
						sortable: true,
					},
					{
						id: 'amountVatRejectOc',
						model: 'AmountVatRejectOc',
						type: FieldType.Decimal,
						label: { text: 'AmountVatRejectOc', key: 'procurement.invoice.header.amountVatRejectOc' },
						sortable: true,
					},
				],
			},
			dialogOptions: {
				headerText: {
					text: 'Invoice Search Dialog',
					key: 'procurement.invoice.invoiceDialogTitle',
				},
			},
			showDialog: true,
		});
	}
}
