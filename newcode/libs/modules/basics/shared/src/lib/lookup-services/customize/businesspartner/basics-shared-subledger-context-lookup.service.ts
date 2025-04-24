/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeSubledgerContextEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeSubledgerContextEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedSubledgerContextLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeSubledgerContextEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/subledgercontext/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '9001265282d64fef85bac6463c7e7bd5',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeSubledgerContextEntity) => x.DescriptionInfo),
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
						id: 'RubricCategoryCFk',
						model: 'RubricCategoryCFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategoryCFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RubricCategorySFk',
						model: 'RubricCategorySFk',
						type: FieldType.Quantity,
						label: { text: 'RubricCategorySFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
