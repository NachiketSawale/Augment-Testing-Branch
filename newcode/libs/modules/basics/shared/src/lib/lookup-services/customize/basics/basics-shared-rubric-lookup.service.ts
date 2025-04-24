/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRubricEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRubricEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRubricLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRubricEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/rubric/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '933afb72d9bf44aba053b6a2b2af2213',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRubricEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
