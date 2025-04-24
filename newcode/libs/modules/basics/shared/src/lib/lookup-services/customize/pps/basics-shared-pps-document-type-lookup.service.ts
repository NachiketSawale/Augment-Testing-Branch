/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsDocumentTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsDocumentTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsDocumentTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsDocumentTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/ppsdocumenttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b5e55d5a29b14c0993212b0f28a9fd43',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizePpsDocumentTypeEntity) => x.DescriptionInfo),
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
						id: 'Icon',
						model: 'Icon',
						type: FieldType.Quantity,
						label: { text: 'Icon' },
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
