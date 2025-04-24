/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePaperSizeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePaperSizeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPaperSizeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePaperSizeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/papersize/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0d910e1561634fb2b4260e0a15131168',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePaperSizeEntity) => x.DescriptionInfo),
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
						id: 'NameInfo',
						model: 'NameInfo',
						type: FieldType.Translation,
						label: { text: 'NameInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Height',
						model: 'Height',
						type: FieldType.Quantity,
						label: { text: 'Height' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Width',
						model: 'Width',
						type: FieldType.Quantity,
						label: { text: 'Width' },
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
