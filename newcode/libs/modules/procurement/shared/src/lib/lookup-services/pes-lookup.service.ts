/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IDescriptionInfo } from '@libs/platform/common';
export interface IPesHeaderLookUpEntity {
	Id: number;
	Code: string;
	Description: string;
	DocumentDate?: Date | null;
	ConCode?: string;
	ControllingUnitCode?: string;
	BpName1?: string;
	SupplierCode?: string;
	PrcStructureCode?: string;
	PrcStructureDescriptionInfo?: IDescriptionInfo | null;
	PesValue?: number;
	PesVat?: number;
	PesValueOc?: number;
	PesVatOc?: number;
	ConHeaderFk?: number;
	PrcHeaderFk?: number;
	SalesTaxMethodFk?: number;
	ControllingUnitFk?: number;
}
@Injectable({
	providedIn: 'root',
})
export class ProcurementSharePesLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IPesHeaderLookUpEntity, TEntity> {
	public constructor() {
		super('InvoicePes', {
			uuid: 'b295d7a52fae4ceda963ffecc43e9189',
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
							//todo
						}),
					},
					{
						id: 'documentDate',
						model: 'DocumentDate',
						type: FieldType.Date,
						label: { text: 'Document Date', key: 'procurement.invoice.entityDocumentDate' },
						sortable: true,
					},
					{
						id: 'conCode',
						model: 'ConCode',
						type: FieldType.Code,
						label: { text: 'Contract', key: 'procurement.invoice.entityConCode' },
						sortable: true,
					},
					{
						id: 'ctrlCode',
						model: 'ControllingUnitCode',
						type: FieldType.Code,
						label: { text: 'Controlling Unit', key: 'procurement.invoice.entityCtrlCode' },
						sortable: true,
					},
					{
						id: 'BPName1',
						model: 'BPName1',
						type: FieldType.Translation,
						label: { text: 'Business Partner', key: 'cloud.common.entityBusinessPartnerName1' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'supplier',
						model: 'SupplierCode',
						type: FieldType.Code,
						label: { text: 'Supplier', key: 'cloud.common.entitySupplier' },
						sortable: true,
					},
					{
						id: 'prcStructureCode',
						model: 'PrcStructureCode',
						type: FieldType.Code,
						label: { text: 'Structure Code', key: 'cloud.common.entityStructureCode' },
						sortable: true,
					},
					{
						id: 'prcStructureDesc',
						model: 'PrcStructureDescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Structure Description', key: 'cloud.common.entityStructureDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'pesValue',
						model: 'PesValue',
						type: FieldType.Decimal,
						label: { text: 'value', key: 'procurement.invoice.entityOriginalValue' },
						sortable: true,
					},
					{
						id: 'pesVat',
						model: 'PesVat',
						type: FieldType.Decimal,
						label: { text: 'VAT', key: 'procurement.invoice.entityOriginalVAT' },
						sortable: true,
					},
					{
						id: 'pesValueOc',
						model: 'PesValueOc',
						type: FieldType.Decimal,
						label: { text: 'Value(OC)', key: 'procurement.invoice.entityOriginalValueOc' },
						sortable: true,
					},
					{
						id: 'pesVatOc',
						model: 'PesVatOc',
						type: FieldType.Decimal,
						label: { text: 'VAT(OC)', key: 'procurement.invoice.entityOriginalVATOc' },
						sortable: true,
					},
				],
			},
			dialogOptions: {
				headerText: {
					text: 'Performance Entry Sheet Search Dialog',
					key: 'procurement.invoice.pesLookupDialogTitle',
				},
			},
			showDialog: true,
		});
	}
}
