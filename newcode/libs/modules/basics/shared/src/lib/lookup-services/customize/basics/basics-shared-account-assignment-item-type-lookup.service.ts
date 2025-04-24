/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountAssignmentItemTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountAssignmentItemTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountAssignmentItemTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountAssignmentItemTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/accountassignmentitemtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8efd50a344d84dd6a41a01ead5248bdb',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
