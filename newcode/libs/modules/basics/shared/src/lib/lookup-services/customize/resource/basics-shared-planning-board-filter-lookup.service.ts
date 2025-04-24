/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlanningBoardFilterEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlanningBoardFilterEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlanningBoardFilterLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlanningBoardFilterEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/planningboardfilter/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3269f5c1266249b9b140377343059b81',
			valueMember: 'Id',
			displayMember: 'ModuleFk',
			gridConfig: {
				columns: [
					{
						id: 'ModuleFk',
						model: 'ModuleFk',
						type: FieldType.Quantity,
						label: { text: 'ModuleFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ResourceTypeFk',
						model: 'ResourceTypeFk',
						type: FieldType.Quantity,
						label: { text: 'ResourceTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
