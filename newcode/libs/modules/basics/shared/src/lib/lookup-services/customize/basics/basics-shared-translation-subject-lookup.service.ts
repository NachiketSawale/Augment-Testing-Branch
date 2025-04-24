/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeTranslationSubjectEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeTranslationSubjectEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedTranslationSubjectLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeTranslationSubjectEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/translationsubject/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b6b2a7f0f13f41d1a591750b673dc1e8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeTranslationSubjectEntity) => x.DescriptionInfo),
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
