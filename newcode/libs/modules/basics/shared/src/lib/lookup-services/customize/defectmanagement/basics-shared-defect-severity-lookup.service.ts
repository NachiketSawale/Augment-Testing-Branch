/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDefectSeverityEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDefectSeverityEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDefectSeverityLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDefectSeverityEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/defectseverity/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c992578a26774ea0afccdab63371328f',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDefectSeverityEntity) => x.DescriptionInfo),
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
