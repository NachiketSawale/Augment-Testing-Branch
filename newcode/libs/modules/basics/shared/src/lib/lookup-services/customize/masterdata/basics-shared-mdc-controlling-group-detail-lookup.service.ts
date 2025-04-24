/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeMdcControllingGroupDetailEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeMdcControllingGroupDetailEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedMdcControllingGroupDetailLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeMdcControllingGroupDetailEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/mdccontrollinggroupdetail/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '1a34645d939847bc8bd0e40c13be2eed',
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
						id: 'ControllinggroupFk',
						model: 'ControllinggroupFk',
						type: FieldType.Quantity,
						label: { text: 'ControllinggroupFk' },
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
