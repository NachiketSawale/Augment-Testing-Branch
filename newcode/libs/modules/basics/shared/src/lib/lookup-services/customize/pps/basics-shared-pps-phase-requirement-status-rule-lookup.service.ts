/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsPhaseRequirementStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsPhaseRequirementStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsPhaseRequirementStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsPhaseRequirementStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsphaserequirementstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '15670d63598342ea8e547dfa4d00238c',
			valueMember: 'Id',
			displayMember: 'PhaseReqStatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PhaseReqStatusFk',
						model: 'PhaseReqStatusFk',
						type: FieldType.Quantity,
						label: { text: 'PhaseReqStatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PhaseReqStatusTargetFk',
						model: 'PhaseReqStatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PhaseReqStatusTargetFk' },
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
