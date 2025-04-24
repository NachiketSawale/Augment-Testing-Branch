/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRelationTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRelationTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRelationTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRelationTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/relationtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '681bd44ae1f34e319a7add86cc650994',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRelationTypeEntity) => x.DescriptionInfo),
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
						id: 'OppositeDescriptionInfo',
						model: 'OppositeDescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'OppositeDescriptionInfo' },
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
					},
					{
						id: 'RelationColor',
						model: 'RelationColor',
						type: FieldType.Quantity,
						label: { text: 'RelationColor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'OppositeRelationColor',
						model: 'OppositeRelationColor',
						type: FieldType.Quantity,
						label: { text: 'OppositeRelationColor' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
