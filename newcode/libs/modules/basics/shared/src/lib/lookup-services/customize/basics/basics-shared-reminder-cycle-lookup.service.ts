/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeReminderCycleEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeReminderCycleEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedReminderCycleLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeReminderCycleEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/remindercycle/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'd0e40ad8a9ee411f8159f3865c435ae0',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeReminderCycleEntity) => x.DescriptionInfo),
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsYearly',
						model: 'IsYearly',
						type: FieldType.Boolean,
						label: { text: 'IsYearly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsMonthly',
						model: 'IsMonthly',
						type: FieldType.Boolean,
						label: { text: 'IsMonthly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsWeekly',
						model: 'IsWeekly',
						type: FieldType.Boolean,
						label: { text: 'IsWeekly' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDaily',
						model: 'IsDaily',
						type: FieldType.Boolean,
						label: { text: 'IsDaily' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
