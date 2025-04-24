/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTransportPackageStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTransportPackageStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTransportPackageStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTransportPackageStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/transportpackagestatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8eba1bfea5c844a2bcad49b423ec3f08',
			valueMember: 'Id',
			displayMember: 'PkgStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PkgStatusFk',
						model: 'PkgStatusFk',
						type: FieldType.Quantity,
						label: { text: 'PkgStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PkgStatusTargetFk',
						model: 'PkgStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PkgStatusTargetFk' },
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
