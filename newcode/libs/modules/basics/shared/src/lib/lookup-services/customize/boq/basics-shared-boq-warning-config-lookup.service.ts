/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBoqWarningConfigEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBoqWarningConfigEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBoqWarningConfigLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBoqWarningConfigEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/boqwarningconfig/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ae1c72ba782241138879cb93697d6a95',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Quantity,
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
						id: 'WarningActionFk',
						model: 'WarningActionFk',
						type: FieldType.Quantity,
						label: { text: 'WarningActionFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
