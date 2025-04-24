/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IProjectStockLookupEntity } from '@libs/basics/interfaces';

/**
 * project stock lookup data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementProjectStockLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IProjectStockLookupEntity, TEntity> {
	public constructor() {
		super('ProjectStockNew', {
			uuid: '0abbfe65f1d448099b50fbf0a4158452',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						type: FieldType.Code,
						label: { key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'desc',
						model: 'Description',
						type: FieldType.Description,
						label: { key: 'cloud.common.entityStockDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					}
				],
			},
		});
	}
}
