/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPrcInventoryHeaderEntity } from '../model/entities/prc-inventory-header-entity.interface';

/**
 * invoice rejection lookup data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInventoryHeaderLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPrcInventoryHeaderEntity, TEntity> {
	public constructor() {
		super('InventoryHeader', {
			uuid: '06a88c5b1c67436fac09c187cb6eb5c0',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'desc',
						model: 'Description',
						type: FieldType.Description,
						label: { key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					}
				],
			},
		});
	}
}
