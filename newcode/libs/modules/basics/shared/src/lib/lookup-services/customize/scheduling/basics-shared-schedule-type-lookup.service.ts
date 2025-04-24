/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeScheduleTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeScheduleTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedScheduleTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeScheduleTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/scheduletype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'eab9c39240864331b3c8a6454897527e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeScheduleTypeEntity) => x.DescriptionInfo),
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
						id: 'SchedulingContextFk',
						model: 'SchedulingContextFk',
						type: FieldType.Quantity,
						label: { text: 'SchedulingContextFk' },
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
						id: 'Isexecution',
						model: 'Isexecution',
						type: FieldType.Boolean,
						label: { text: 'Isexecution' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isprocurement',
						model: 'Isprocurement',
						type: FieldType.Boolean,
						label: { text: 'Isprocurement' },
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
						id: 'CodeFormatFk',
						model: 'CodeFormatFk',
						type: FieldType.Quantity,
						label: { text: 'CodeFormatFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
