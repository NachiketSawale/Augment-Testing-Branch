/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeVATGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeVATGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedVATGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeVATGroupEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/vatgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'ea6f73cd9f414814a287b1a52a598b1c',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeVATGroupEntity) => x.DescriptionInfo),
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
						id: 'Reference',
						model: 'Reference',
						type: FieldType.Quantity,
						label: { text: 'Reference' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
