/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePackageStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePackageStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPackageStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePackageStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/packagestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd6597cd7a88e45adb557c1d306f58a0f',
			valueMember: 'Id',
			displayMember: 'PackagestatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PackagestatusFk',
						model: 'PackagestatusFk',
						type: FieldType.Quantity,
						label: { text: 'PackagestatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PackagestatusTargetFk',
						model: 'PackagestatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PackagestatusTargetFk' },
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
