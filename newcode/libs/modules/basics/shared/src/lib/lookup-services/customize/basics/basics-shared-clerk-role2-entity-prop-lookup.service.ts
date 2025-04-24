/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeClerkRole2EntityPropEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeClerkRole2EntityPropEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedClerkRole2EntityPropLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeClerkRole2EntityPropEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/clerkrole2entityprop/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '87b79cb56c5942be852b508a79f1a618',
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
						id: 'Entity',
						model: 'Entity',
						type: FieldType.Quantity,
						label: { text: 'Entity' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Attribute',
						model: 'Attribute',
						type: FieldType.Quantity,
						label: { text: 'Attribute' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ClerkRoleFk',
						model: 'ClerkRoleFk',
						type: FieldType.Quantity,
						label: { text: 'ClerkRoleFk' },
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
