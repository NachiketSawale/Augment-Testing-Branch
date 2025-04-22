/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class SalesWipAccrualLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IWipHeaderEntity, TEntity> {
	public constructor() {
		const endpoint =
			{
				httpRead:
					{
						route: 'basics/lookupdata/master/getlist',
						endPointRead: '?lookup=wipaccrualmode',
						usePostForRead: false
					}
			};

		const gridConfig: ILookupConfig<IWipHeaderEntity, TEntity> = {
			uuid: 'd2870add907443638fefd6f9dcb52134',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',
			gridConfig: {
				uuid: 'd2870add907443638fefd6f9dcb52134',
				columns: [
					{id: 'WipAccrualMode', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Status Name'}, sortable: true, visible: true, readonly: true},
				],
			},
			dialogOptions: {
				headerText: 'Wip Accruals',
				alerts: []
			},
			showDialog: true,
		};

		super(endpoint, gridConfig);
	}
}