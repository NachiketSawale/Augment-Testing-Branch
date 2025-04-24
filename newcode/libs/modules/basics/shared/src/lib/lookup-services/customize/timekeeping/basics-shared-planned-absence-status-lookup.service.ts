/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlannedAbsenceStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlannedAbsenceStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlannedAbsenceStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlannedAbsenceStatusEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plannedabsencestatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8dbe7e001bcc412980fbe3f6cc6ed470',
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
						id: 'IsApproved',
						model: 'IsApproved',
						type: FieldType.Boolean,
						label: { text: 'IsApproved' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsApplied',
						model: 'IsApplied',
						type: FieldType.Boolean,
						label: { text: 'IsApplied' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsReadOnly',
						model: 'IsReadOnly',
						type: FieldType.Boolean,
						label: { text: 'IsReadOnly' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
