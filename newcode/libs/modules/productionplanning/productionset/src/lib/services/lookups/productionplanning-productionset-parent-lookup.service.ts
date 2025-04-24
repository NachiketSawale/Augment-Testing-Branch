/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IProductionsetEntity } from '../../model/models';

@Injectable({
	providedIn: 'root',
})
export class ProductionSetParentLookupService extends UiCommonLookupEndpointDataService<IProductionsetEntity> {
	public constructor() {
		super(
			{ httpRead: { route: 'basics/lookupdata/master/', endPointRead: 'getlist?lookup=productionsetlookup' } },
			{
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig:<IGridConfiguration<IProductionsetEntity>> {
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							displayMember: 'Code',
							label: { text: 'Code', key: 'cloud.common.entityCode'},
							visible: true,
							readonly: true,
							sortable: true,
						},
						{ 	id: 'Description',
							model: 'DescriptionInfo.Description',
							type: FieldType.Description,
							label: { text: 'Description' , key: 'cloud.common.entityDescription'},
							visible: true,
							readonly: true,
							sortable: true
						},
					],
				},
				uuid: 'b6f99b16e88645f3a00298dd55c50eb9',
			},

		);
	}

}
