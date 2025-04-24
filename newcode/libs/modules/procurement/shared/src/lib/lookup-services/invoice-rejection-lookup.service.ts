/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IInvRejectLookupEntity } from './entities/inv-reject-lookup-entity.interface';

/**
 * invoice rejection lookup data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceRejectionLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IInvRejectLookupEntity, TEntity> {
	public constructor() {
		super('InvRejectLookupV', {
			uuid: '63484025580b43c899d6a9422ffba029',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'code',
						type: FieldType.Code,
						label: { key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'desc',
						model: 'Description',
						type: FieldType.Description,
						label: { key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'invRejectionReason',
						model: 'InvRejectionReason',
						type: FieldType.Description,
						label: { key: 'procurement.invoice.entityRejection' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'amountNetTotal',
						model: 'AmountNetTotal',
						type: FieldType.Money,
						label: { key: 'procurement.invoice.header.amountNet' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'amountNetTotalOc',
						model: 'AmountNetTotalOc',
						type: FieldType.Money,
						label: { key: 'procurement.invoice.header.amountNetOC' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'dateInvoiced',
						model: 'DateInvoiced',
						type: FieldType.Date,
						label: { key: 'procurement.invoice.header.dateInvoiced' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'dateReceived',
						model: 'DateReceived',
						type: FieldType.Date,
						label: { key: 'procurement.invoice.header.dateReceived' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'reference',
						model: 'Reference',
						type: FieldType.Description,
						label: { key: 'procurement.invoice.header.reference' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
		});
	}
}
