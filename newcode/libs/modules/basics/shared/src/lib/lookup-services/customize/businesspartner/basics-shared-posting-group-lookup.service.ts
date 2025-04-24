/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePostingGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePostingGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPostingGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePostingGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/postinggroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '24ce9902e786461ea99b31ff3f093c9e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePostingGroupEntity) => x.DescriptionInfo),
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
						id: 'SubledgerContextFk',
						model: 'SubledgerContextFk',
						type: FieldType.Quantity,
						label: { text: 'SubledgerContextFk' },
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
						id: 'GroupFinance',
						model: 'GroupFinance',
						type: FieldType.Description,
						label: { text: 'GroupFinance' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
