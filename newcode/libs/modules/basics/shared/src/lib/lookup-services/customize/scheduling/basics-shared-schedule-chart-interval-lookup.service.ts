/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeScheduleChartIntervalEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeScheduleChartIntervalEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedScheduleChartIntervalLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeScheduleChartIntervalEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/schedulechartinterval/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '09e2343cf06b4d389a268b9f5d16a48c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeScheduleChartIntervalEntity) => x.DescriptionInfo),
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
