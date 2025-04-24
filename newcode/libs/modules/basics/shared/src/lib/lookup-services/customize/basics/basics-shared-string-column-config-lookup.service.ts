/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeStringColumnConfigEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeStringColumnConfigEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedStringColumnConfigLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeStringColumnConfigEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/stringcolumnconfig/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8bc4bece7518428dadd28402054c8120',
			valueMember: 'Id',
			displayMember: 'ModuleName',
			gridConfig: {
				columns: [
					{
						id: 'ModuleName',
						model: 'ModuleName',
						type: FieldType.Quantity,
						label: { text: 'ModuleName' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TableName',
						model: 'TableName',
						type: FieldType.Quantity,
						label: { text: 'TableName' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ColumnName',
						model: 'ColumnName',
						type: FieldType.Quantity,
						label: { text: 'ColumnName' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ColumnSize',
						model: 'ColumnSize',
						type: FieldType.Quantity,
						label: { text: 'ColumnSize' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaxLength',
						model: 'MaxLength',
						type: FieldType.Quantity,
						label: { text: 'MaxLength' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
