/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeScopeOfSupplyTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeScopeOfSupplyTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedScopeOfSupplyTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeScopeOfSupplyTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/scopeofsupplytype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '6b0dc8f11d584786ac00e71e311c2e34',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeScopeOfSupplyTypeEntity) => x.DescriptionInfo),
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
						id: 'Ispricecomponent',
						model: 'Ispricecomponent',
						type: FieldType.Boolean,
						label: { text: 'Ispricecomponent' },
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
