/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IBasicsStateEntity } from '@libs/basics/interfaces';


/**
 * State Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedStateLookupService<TEntity extends object = object> extends UiCommonLookupTypeLegacyDataService<IBasicsStateEntity, TEntity> {
	public constructor() {
		super('State', {
			uuid: '44e715f95b7c44d8b5bf91e43312f53e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'State',
						model: 'State',
						type: FieldType.Code,
						label: { text: 'State', key: 'cloud.common.AddressDialogState' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		},);

	}
}
