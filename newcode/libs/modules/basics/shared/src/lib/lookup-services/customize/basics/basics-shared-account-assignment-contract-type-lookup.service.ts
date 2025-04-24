/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeAccountAssignmentContractTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeAccountAssignmentContractTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedAccountAssignmentContractTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeAccountAssignmentContractTypeEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/accountassignmentcontracttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd482b3dadef049e9b0eca78ce023278b',
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
					},
					{
						id: 'IsCreateInvaccount',
						model: 'IsCreateInvaccount',
						type: FieldType.Boolean,
						label: { text: 'IsCreateInvaccount' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
