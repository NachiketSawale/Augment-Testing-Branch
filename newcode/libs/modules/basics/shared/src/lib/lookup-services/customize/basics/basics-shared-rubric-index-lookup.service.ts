/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRubricIndexEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRubricIndexEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRubricIndexLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRubricIndexEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/rubricindex/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0cda977d428848f08fec18363d46a6ac',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRubricIndexEntity) => x.DescriptionInfo),
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
						id: 'RubricFk',
						model: 'RubricFk',
						type: FieldType.Quantity,
						label: { text: 'RubricFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
