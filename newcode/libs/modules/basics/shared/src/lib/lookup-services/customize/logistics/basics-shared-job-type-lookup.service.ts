/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeJobTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeJobTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedJobTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeJobTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/jobtype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ffd47869fdc4403f98af96e06b90fac4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeJobTypeEntity) => x.DescriptionInfo),
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
						id: 'IsExternal',
						model: 'IsExternal',
						type: FieldType.Boolean,
						label: { text: 'IsExternal' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ReportFk',
						model: 'ReportFk',
						type: FieldType.Quantity,
						label: { text: 'ReportFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Report2Fk',
						model: 'Report2Fk',
						type: FieldType.Quantity,
						label: { text: 'Report2Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RubricCategoryFk',
						model: 'RubricCategoryFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryFk' },
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
						id: 'IsMaintenance',
						model: 'IsMaintenance',
						type: FieldType.Boolean,
						label: { text: 'IsMaintenance' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCenter',
						model: 'IsCenter',
						type: FieldType.Boolean,
						label: { text: 'IsCenter' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPoolJob',
						model: 'IsPoolJob',
						type: FieldType.Boolean,
						label: { text: 'IsPoolJob' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsJointVenture',
						model: 'IsJointVenture',
						type: FieldType.Boolean,
						label: { text: 'IsJointVenture' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsForPlantSupply',
						model: 'IsForPlantSupply',
						type: FieldType.Boolean,
						label: { text: 'IsForPlantSupply' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsVoid',
						model: 'IsVoid',
						type: FieldType.Boolean,
						label: { text: 'IsVoid' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HasLoadingCost',
						model: 'HasLoadingCost',
						type: FieldType.Boolean,
						label: { text: 'HasLoadingCost' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
