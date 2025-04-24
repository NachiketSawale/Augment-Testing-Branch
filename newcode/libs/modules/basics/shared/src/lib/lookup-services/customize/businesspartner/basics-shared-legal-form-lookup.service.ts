/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeLegalFormEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeLegalFormEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedLegalFormLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeLegalFormEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/legalform/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a52a7692aebd4c959970fb9c0c73b97e',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeLegalFormEntity) => x.DescriptionInfo),
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
						id: 'CountryFk',
						model: 'CountryFk',
						type: FieldType.Quantity,
						label: { text: 'CountryFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
