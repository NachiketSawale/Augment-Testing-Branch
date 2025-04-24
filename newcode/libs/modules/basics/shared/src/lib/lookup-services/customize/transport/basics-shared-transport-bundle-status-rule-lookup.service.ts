/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportBundleStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportBundleStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportBundleStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportBundleStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportbundlestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9c55e4d8349b416caae8788af9aa1961',
			valueMember: 'Id',
			displayMember: 'BundleStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'BundleStatusFk',
						model: 'BundleStatusFk',
						type: FieldType.Quantity,
						label: { text: 'BundleStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BundleStatusTargetFk',
						model: 'BundleStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'BundleStatusTargetFk' },
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
