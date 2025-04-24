/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBillTypeEntity } from '../model/entities/sales-contract-bill-type-entity.interface';
import { IBillTypeEntityGenerated } from '../model/entities/sales-contract-bill-type-entity-generated.interface';

@Injectable({
	providedIn: 'root'
})
export class SalesContractBillTypeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBillTypeEntity, TEntity> {

	public constructor() {

		const endpoint =
			{
				httpRead:
					{
						route: 'basics/customize/BillType/',
						endPointRead: 'list',
						usePostForRead: true,
					}
			};

		const gridConfig: ILookupConfig<IBillTypeEntityGenerated, TEntity> = {
			uuid: '7ecae6183c404ec99eeea138e5754e65',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',
			gridConfig: {
				uuid: '7ecae6183c404ec99eeea138e5754e65',
				columns: [
					{id: 'description', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true, width: 200}
				],
			},
			dialogOptions: {
				headerText: 'Bill Type',
				alerts: []
			},
			// showGrid: true,
			showDialog: false,
		};

		super(endpoint, gridConfig);
	}
}