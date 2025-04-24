/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRelationKindEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRelationKindEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRelationKindLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRelationKindEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/relationkind/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'c35acde741724d9c9a301d27a320f05c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRelationKindEntity) => x.DescriptionInfo),
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
						id: 'Shortdesc',
						model: 'Shortdesc',
						type: FieldType.Quantity,
						label: { text: 'Shortdesc' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
