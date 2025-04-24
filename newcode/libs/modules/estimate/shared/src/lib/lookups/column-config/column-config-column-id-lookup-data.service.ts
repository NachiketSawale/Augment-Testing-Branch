/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
import { Injectable } from '@angular/core';

/**
 * Column Config Column Id Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ColumnConfigColumnIdLookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IBasicsUomEntity, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'estimate/main/columnconfigdetail/', endPointRead: 'columnIdLookup' },
			},
			{
				uuid: '01faa125dc93475d80a5407dd67e0ed7',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig: {
					columns: [
						{
							id: 'Description',
							model: 'Description',
							type: FieldType.Description,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
			},
		);
	}
}
