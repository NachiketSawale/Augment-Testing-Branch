/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IBasicsEfbsheetsAverageWageEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})

/**
 * BasicsEfbSheetsWageGroupLookupService - Lookup service for wage groups
 */
export class BasicsEfbSheetsWageGroupLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicsEfbsheetsAverageWageEntity, TEntity> {
	public constructor() {
		
		/**
		 * Endpoint for wage groups
		 */
		const endpoint = { httpRead: { route: 'basics/efbsheets/averagewages/', endPointRead: 'listofwagegroups' } };

		/**
		 * Configuration for wage groups
		 */
		const gridConfig: ILookupConfig<IBasicsEfbsheetsAverageWageEntity, TEntity> = {
			uuid: 'bca22c43a73a4138a9f61f46b42bbe12',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'Code',

			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Group',
						model: 'Group',
						type: FieldType.Code,
						label: { text: 'basics.customize.group' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MarkUpRate',
						model: 'MarkupRate',
						type: FieldType.Money,
						label: { text: 'basics.efbsheets.markupRate' },
						sortable: true,
						visible: true,
						readonly: true
					},
				],
			},
			showGrid: true,
		};
		super(endpoint, gridConfig);
	}
}
