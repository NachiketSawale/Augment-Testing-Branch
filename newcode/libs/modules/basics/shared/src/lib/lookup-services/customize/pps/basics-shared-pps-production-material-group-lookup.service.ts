/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePpsProductionMaterialGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePpsProductionMaterialGroupEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPpsProductionMaterialGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePpsProductionMaterialGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/ppsproductionmaterialgroup/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'bc89dedf2c9945b1ad777f9c0c6aaff6',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
