/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePerformanceSheetEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePerformanceSheetEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPerformanceSheetLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePerformanceSheetEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/performancesheet/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '46cea69e039f4de7adcf77fae602fb84',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePerformanceSheetEntity) => x.DescriptionInfo),
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
