/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeObjectPriceListDetailEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeObjectPriceListDetailEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedObjectPriceListDetailLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeObjectPriceListDetailEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/objectpricelistdetail/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '7c3dfd54c5784e03935930f70cac18a5',
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
					},
					{
						id: 'Specification',
						model: 'Specification',
						type: FieldType.Comment,
						label: { text: 'Specification' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Quantity,
						label: { text: 'UomFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Unitprice',
						model: 'Unitprice',
						type: FieldType.Quantity,
						label: { text: 'Unitprice' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'StructureFk',
						model: 'StructureFk',
						type: FieldType.Quantity,
						label: { text: 'StructureFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PricelistFk',
						model: 'PricelistFk',
						type: FieldType.Quantity,
						label: { text: 'PricelistFk' },
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
