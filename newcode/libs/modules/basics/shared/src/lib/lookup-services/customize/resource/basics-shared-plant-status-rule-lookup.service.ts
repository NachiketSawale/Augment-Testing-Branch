/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c72f10496ff646199b2e63fa5304cb6e',
			valueMember: 'Id',
			displayMember: 'PlantstatusFk',
			gridConfig: {
				columns: [
					{
						id: 'PlantstatusFk',
						model: 'PlantstatusFk',
						type: FieldType.Quantity,
						label: { text: 'PlantstatusFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PlantstatusTargetFk',
						model: 'PlantstatusTargetFk',
						type: FieldType.Quantity,
						label: { text: 'PlantstatusTargetFk' },
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
