/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';


@Injectable({
	providedIn: 'root',
})

/**
 * BasicsEfbSheetsAdditionalCostLookupService - lookup service for additional cost
 */
export class BasicsEfbSheetsAdditionalCostLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IEstCrewMixAfsnEntity, TEntity> {

	public constructor() {

        /**
         * endpoint for additional cost lookup service
         */
		const endpoint = { httpRead: { route: 'basics/efbsheets/crewmixafsn/', endPointRead: 'listofadditionalcosts' } };

        /**
         * grid configuration for additional cost lookup service
         */
		const gridConfig: ILookupConfig<IEstCrewMixAfsnEntity, TEntity> = {
			uuid: 'a864c999997142a28c7130e214203c58',
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
