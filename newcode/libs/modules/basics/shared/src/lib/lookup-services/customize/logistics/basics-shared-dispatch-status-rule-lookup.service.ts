/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDispatchStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDispatchStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDispatchStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDispatchStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/dispatchstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd12f8f492f9342d1b431ca177907dd29',
			valueMember: 'Id',
			displayMember: 'DispatchStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'DispatchStatusFk',
						model: 'DispatchStatusFk',
						type: FieldType.Quantity,
						label: { text: 'DispatchStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DispatchStatustrgtFk',
						model: 'DispatchStatustrgtFk',
						type: FieldType.Quantity,
						label: { text: 'DispatchStatustrgtFk' },
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
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Hasrolevalidation',
						model: 'Hasrolevalidation',
						type: FieldType.Boolean,
						label: { text: 'Hasrolevalidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
