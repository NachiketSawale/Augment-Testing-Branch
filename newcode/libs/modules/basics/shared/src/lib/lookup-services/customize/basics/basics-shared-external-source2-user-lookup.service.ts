/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeExternalSource2UserEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeExternalSource2UserEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedExternalSource2UserLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeExternalSource2UserEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/externalsource2user/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '229b753ec52a48919ca320744373e5ed',
			valueMember: 'Id',
			displayMember: 'ExternalsourceFk',
			gridConfig: {
				columns: [
					{
						id: 'ExternalsourceFk',
						model: 'ExternalsourceFk',
						type: FieldType.Quantity,
						label: { text: 'ExternalsourceFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserFk',
						model: 'UserFk',
						type: FieldType.Quantity,
						label: { text: 'UserFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Username',
						model: 'Username',
						type: FieldType.Comment,
						label: { text: 'Username' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Password',
						model: 'Password',
						type: FieldType.Quantity,
						label: { text: 'Password' },
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
					},
					{
						id: 'EncryptiontypeFk',
						model: 'EncryptiontypeFk',
						type: FieldType.Quantity,
						label: { text: 'EncryptiontypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
