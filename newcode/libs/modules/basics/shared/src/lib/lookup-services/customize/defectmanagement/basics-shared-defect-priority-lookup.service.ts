/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDefectPriorityEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDefectPriorityEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDefectPriorityLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDefectPriorityEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/defectpriority/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9f7417482f8241e4813107b8918012c1',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDefectPriorityEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
