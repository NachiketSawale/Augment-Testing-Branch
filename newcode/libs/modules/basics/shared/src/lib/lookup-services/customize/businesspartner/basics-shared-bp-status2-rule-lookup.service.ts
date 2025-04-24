/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeBpStatus2RuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeBpStatus2RuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedBpStatus2RuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeBpStatus2RuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/bpstatus2rule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '849005cdacb44feaa99fdbef6ba205ba',
			valueMember: 'Id',
			displayMember: 'Status2Fk',
			gridConfig: {
				columns: [
					{
						id: 'Status2Fk',
						model: 'Status2Fk',
						type: FieldType.Quantity,
						label: { text: 'Status2Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Status2TargetFk',
						model: 'Status2TargetFk',
						type: FieldType.Quantity,
						label: { text: 'Status2TargetFk' },
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
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
