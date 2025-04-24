/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportRteStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportRteStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportRteStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportRteStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportrtestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'e1844f52114a4922bc4b5d9761a39c39',
			valueMember: 'Id',
			displayMember: 'RteStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'RteStatusFk',
						model: 'RteStatusFk',
						type: FieldType.Quantity,
						label: { text: 'RteStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RteStatusTargetFk',
						model: 'RteStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'RteStatusTargetFk' },
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
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
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
