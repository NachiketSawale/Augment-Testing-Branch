/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTimekeepingEmployeeSkillStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTimekeepingEmployeeSkillStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTimekeepingEmployeeSkillStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTimekeepingEmployeeSkillStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/timekeepingemployeeskillstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ee4db9ed54da41f1bfb44785090bea93',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTimekeepingEmployeeSkillStatusEntity) => x.DescriptionInfo),
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
						id: 'IsDue',
						model: 'IsDue',
						type: FieldType.Boolean,
						label: { text: 'IsDue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsActual',
						model: 'IsActual',
						type: FieldType.Boolean,
						label: { text: 'IsActual' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsPlanned',
						model: 'IsPlanned',
						type: FieldType.Boolean,
						label: { text: 'IsPlanned' },
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
						id: 'TrafficlightFk',
						model: 'TrafficlightFk',
						type: FieldType.Quantity,
						label: { text: 'TrafficlightFk' },
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
					}
				]
			}
		});
	}
}
