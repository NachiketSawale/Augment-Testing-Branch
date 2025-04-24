/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeScheduleImportPropEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeScheduleImportPropEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedScheduleImportPropLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeScheduleImportPropEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/scheduleimportprop/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '79f43ec57bb34a11aa4efdd023b6f4c3',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeScheduleImportPropEntity) => x.DescriptionInfo),
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
						id: 'DisplaydomainFk',
						model: 'DisplaydomainFk',
						type: FieldType.Quantity,
						label: { text: 'DisplaydomainFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
