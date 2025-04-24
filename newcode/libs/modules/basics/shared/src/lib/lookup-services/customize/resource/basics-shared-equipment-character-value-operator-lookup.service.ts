/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEquipmentCharacterValueOperatorEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEquipmentCharacterValueOperatorEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEquipmentCharacterValueOperatorLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEquipmentCharacterValueOperatorEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/equipmentcharactervalueoperator/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6d6be774f3354b5ea32b069ec5215cf6',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEquipmentCharacterValueOperatorEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
