/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { ICompanyEntity } from '@libs/basics/interfaces';

/**
 * company Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCompanyLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ICompanyEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('company', {
			uuid: '7ad57f370fb745e2b518de209bce604c',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '6ed1e2778328490fbcb5c7c6470e5608',
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Description,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 80
					},
					{
						id: 'name',
						model: 'CompanyName',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityName' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 120
					},
					{
						id: 'isLive',
						model: 'IsLive',
						type: FieldType.Boolean,
						label: { text: 'Active', key: 'cloud.common.entityIsLive' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 100
					}
				]
			},
			showDialog: false,
			showGrid: true
		});
	}
}