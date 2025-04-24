/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectUnitKindEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectUnitKindEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectUnitKindLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectUnitKindEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/objectunitkind/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a5a548a16d3a4f8391d79eb1fd2d2675',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeObjectUnitKindEntity) => x.DescriptionInfo),
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
