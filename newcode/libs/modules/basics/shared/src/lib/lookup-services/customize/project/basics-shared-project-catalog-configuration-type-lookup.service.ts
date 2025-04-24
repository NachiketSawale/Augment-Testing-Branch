/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeProjectCatalogConfigurationTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeProjectCatalogConfigurationTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedProjectCatalogConfigurationTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeProjectCatalogConfigurationTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/projectcatalogconfigurationtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7553f8a1a87342b79c39a082e4a6ff59',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeProjectCatalogConfigurationTypeEntity) => x.DescriptionInfo),
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
						id: 'CatConfigFk',
						model: 'CatConfigFk',
						type: FieldType.Quantity,
						label: { text: 'CatConfigFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LineitemcontextFk',
						model: 'LineitemcontextFk',
						type: FieldType.Quantity,
						label: { text: 'LineitemcontextFk' },
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
						id: 'IsProject',
						model: 'IsProject',
						type: FieldType.Boolean,
						label: { text: 'IsProject' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsConstructionSystem',
						model: 'IsConstructionSystem',
						type: FieldType.Boolean,
						label: { text: 'IsConstructionSystem' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsMaterial',
						model: 'IsMaterial',
						type: FieldType.Boolean,
						label: { text: 'IsMaterial' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsActivityCriteria',
						model: 'IsActivityCriteria',
						type: FieldType.Boolean,
						label: { text: 'IsActivityCriteria' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsEmployee',
						model: 'IsEmployee',
						type: FieldType.Boolean,
						label: { text: 'IsEmployee' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAssembly',
						model: 'IsAssembly',
						type: FieldType.Boolean,
						label: { text: 'IsAssembly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsWorkItemCatalog',
						model: 'IsWorkItemCatalog',
						type: FieldType.Boolean,
						label: { text: 'IsWorkItemCatalog' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
