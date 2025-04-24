/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDispatchRecordStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDispatchRecordStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDispatchRecordStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDispatchRecordStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/dispatchrecordstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7455bc78d24040928b9b5aed07d34ea8',
			valueMember: 'Id',
			displayMember: 'DspatchrecStatFk',
			gridConfig: {
				columns: [
					{
						id: 'DspatchrecStatFk',
						model: 'DspatchrecStatFk',
						type: FieldType.Quantity,
						label: { text: 'DspatchrecStatFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DspatchrecStatTargetFk',
						model: 'DspatchrecStatTargetFk',
						type: FieldType.Quantity,
						label: { text: 'DspatchrecStatTargetFk' },
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
