/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEquipmentFixedAssetEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEquipmentFixedAssetEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEquipmentFixedAssetLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEquipmentFixedAssetEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/equipmentfixedasset/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0416967acbd24742801ef0fbe536bb76',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EquipmentContextFk',
						model: 'EquipmentContextFk',
						type: FieldType.Quantity,
						label: { text: 'EquipmentContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Asset',
						model: 'Asset',
						type: FieldType.Code,
						label: { text: 'Asset' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CompanyFk',
						model: 'CompanyFk',
						type: FieldType.Quantity,
						label: { text: 'CompanyFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Inactive',
						model: 'Inactive',
						type: FieldType.Boolean,
						label: { text: 'Inactive' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Blocked',
						model: 'Blocked',
						type: FieldType.Boolean,
						label: { text: 'Blocked' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'StartDate',
						model: 'StartDate',
						type: FieldType.DateUtc,
						label: { text: 'StartDate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EndDate',
						model: 'EndDate',
						type: FieldType.DateUtc,
						label: { text: 'EndDate' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
