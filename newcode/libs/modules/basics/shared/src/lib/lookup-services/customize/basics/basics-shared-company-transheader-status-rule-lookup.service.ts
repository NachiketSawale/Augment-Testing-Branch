/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeCompanyTransheaderStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeCompanyTransheaderStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedCompanyTransheaderStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeCompanyTransheaderStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/companytransheaderstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '30eb008655ac4301b85a495479e71fa0',
			valueMember: 'Id',
			displayMember: 'CompanyTransheaderStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'CompanyTransheaderStatusFk',
						model: 'CompanyTransheaderStatusFk',
						type: FieldType.Quantity,
						label: { text: 'CompanyTransheaderStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CompanyTransheaderStatusTargetFk',
						model: 'CompanyTransheaderStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'CompanyTransheaderStatusTargetFk' },
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
						id: 'HasRoleValidation',
						model: 'HasRoleValidation',
						type: FieldType.Boolean,
						label: { text: 'HasRoleValidation' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
