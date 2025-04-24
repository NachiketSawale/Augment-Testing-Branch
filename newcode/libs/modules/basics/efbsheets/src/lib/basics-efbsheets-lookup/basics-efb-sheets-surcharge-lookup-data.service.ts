/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IEstCrewMixAfEntity } from '@libs/basics/interfaces';


@Injectable({
	providedIn: 'root',
})

/**
 * BasicsEfbSheetsSurchargeLookupService - lookup service for surcharge
 */
export class BasicsEfbSheetsSurchargeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IEstCrewMixAfEntity, TEntity> {
	public constructor() {

		/**
		 * endpoint for surcharge lookup service
		 */
		const endpoint = { httpRead: { route: 'basics/efbsheets/crewmixaf/', endPointRead: 'listofsurcharges' } };

		/**
		 * grid configuration for surcharge lookup service
		 */
		const gridConfig: ILookupConfig<IEstCrewMixAfEntity, TEntity> = {
			uuid: '88d3029b683241faa58a28d3ad27ac0d',
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
