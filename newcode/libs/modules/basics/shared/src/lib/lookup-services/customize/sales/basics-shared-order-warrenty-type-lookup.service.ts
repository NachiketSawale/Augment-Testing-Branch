/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeOrderWarrentyTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeOrderWarrentyTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedOrderWarrentyTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeOrderWarrentyTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/orderwarrentytype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5337f62cac574e179ed240bc1856cb84',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeOrderWarrentyTypeEntity) => x.DescriptionInfo),
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
