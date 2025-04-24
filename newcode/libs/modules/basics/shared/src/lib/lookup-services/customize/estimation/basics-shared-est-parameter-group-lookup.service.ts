/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEstParameterGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEstParameterGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEstParameterGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEstParameterGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/estparametergroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd2779b5aa9e642df9f81dd100a34ca8f',
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
