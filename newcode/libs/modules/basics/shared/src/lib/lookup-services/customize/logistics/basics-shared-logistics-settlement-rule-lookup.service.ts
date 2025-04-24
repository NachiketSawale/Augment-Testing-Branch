/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLogisticsSettlementRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLogisticsSettlementRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLogisticsSettlementRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLogisticsSettlementRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/logisticssettlementrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '3389a627a7224587925ee74cc5b63eff',
			valueMember: 'Id',
			displayMember: 'SettlementstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'SettlementstatusFk',
						model: 'SettlementstatusFk',
						type: FieldType.Quantity,
						label: { text: 'SettlementstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SettlementstatusTargetFk',
						model: 'SettlementstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'SettlementstatusTargetFk' },
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
