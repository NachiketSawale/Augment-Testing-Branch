/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEquipmentCatalogCodeContentEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEquipmentCatalogCodeContentEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEquipmentCatalogCodeContentLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEquipmentCatalogCodeContentEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/equipmentcatalogcodecontent/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'f6bda0bc774649508392c6f6c88f8d5f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeEquipmentCatalogCodeContentEntity) => x.DescriptionInfo),
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
						id: 'QuantityFactor1',
						model: 'QuantityFactor1',
						type: FieldType.Quantity,
						label: { text: 'QuantityFactor1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Precision1',
						model: 'Precision1',
						type: FieldType.Quantity,
						label: { text: 'Precision1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Inputsource1Fk',
						model: 'Inputsource1Fk',
						type: FieldType.Quantity,
						label: { text: 'Inputsource1Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Separator',
						model: 'Separator',
						type: FieldType.Quantity,
						label: { text: 'Separator' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'QuantityFactor2',
						model: 'QuantityFactor2',
						type: FieldType.Quantity,
						label: { text: 'QuantityFactor2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Precision2',
						model: 'Precision2',
						type: FieldType.Quantity,
						label: { text: 'Precision2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Inputsource2Fk',
						model: 'Inputsource2Fk',
						type: FieldType.Quantity,
						label: { text: 'Inputsource2Fk' },
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
