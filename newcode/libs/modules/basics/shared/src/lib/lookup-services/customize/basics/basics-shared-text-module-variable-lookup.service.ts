/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTextModuleVariableEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTextModuleVariableEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTextModuleVariableLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTextModuleVariableEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/textmodulevariable/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9d33e4be7a284ebfb62071661a87391c',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Description,
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
