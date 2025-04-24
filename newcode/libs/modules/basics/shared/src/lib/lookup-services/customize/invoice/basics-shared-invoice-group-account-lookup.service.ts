/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInvoiceGroupAccountEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInvoiceGroupAccountEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInvoiceGroupAccountLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInvoiceGroupAccountEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/invoicegroupaccount/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7df5606978444d03a2a335a6c0ce015e',
			valueMember: 'Id',
			displayMember: 'GroupFk',
			gridConfig: {
				columns: [
					{
						id: 'GroupFk',
						model: 'GroupFk',
						type: FieldType.Quantity,
						label: { text: 'GroupFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LedgerContextFk',
						model: 'LedgerContextFk',
						type: FieldType.Quantity,
						label: { text: 'LedgerContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Account',
						model: 'Account',
						type: FieldType.Code,
						label: { text: 'Account' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'OffsetAccount',
						model: 'OffsetAccount',
						type: FieldType.Code,
						label: { text: 'OffsetAccount' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension01',
						model: 'NominalDimension01',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension01' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension02',
						model: 'NominalDimension02',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension02' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension03',
						model: 'NominalDimension03',
						type: FieldType.Quantity,
						label: { text: 'NominalDimension03' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'OffsetNominalDimension01',
						model: 'OffsetNominalDimension01',
						type: FieldType.Quantity,
						label: { text: 'OffsetNominalDimension01' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'OffsetNominalDimension02',
						model: 'OffsetNominalDimension02',
						type: FieldType.Quantity,
						label: { text: 'OffsetNominalDimension02' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'OffsetNominalDimension03',
						model: 'OffsetNominalDimension03',
						type: FieldType.Quantity,
						label: { text: 'OffsetNominalDimension03' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
