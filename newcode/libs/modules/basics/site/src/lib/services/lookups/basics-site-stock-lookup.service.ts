/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { BasicsSite2StockEntity } from '../../model/basics-site2-stock-entity.class';

@Injectable({
	providedIn: 'root',
})
export class BasicsSiteStockLookupService<IEntity extends object> extends UiCommonLookupTypeDataService<BasicsSite2StockEntity, IEntity> {
	public constructor() {
		super('projectstocknew', {
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						visible: true,
						readonly: true,
						sortable: true,
						width: 100,
					},
					{
						id: 'Description',
						type: FieldType.Description,
						label: { text: 'Site', key: 'cloud.common.entityDescription' },
						visible: true,
						readonly: true,
						sortable: true,
						width: 100,
					},
				],
			},
			uuid: '514c535ed0b74ef3bff7d0acb69d1e26',
		});
	}
}
