/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantSupplyItemStatusRuleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantSupplyItemStatusRuleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantSupplyItemStatusRuleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantSupplyItemStatusRuleEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantsupplyitemstatusrule/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'aae5a458a55744e4807ba4f102563fed',
			valueMember: 'Id',
			displayMember: 'PlantSupItemStatFk',
			gridConfig: {
				columns: [
					{
						id: 'PlantSupItemStatFk',
						model: 'PlantSupItemStatFk',
						type: FieldType.Quantity,
						label: { text: 'PlantSupItemStatFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PlantSupItemStatsTrgtFk',
						model: 'PlantSupItemStatsTrgtFk',
						type: FieldType.Quantity,
						label: { text: 'PlantSupItemStatsTrgtFk' },
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
