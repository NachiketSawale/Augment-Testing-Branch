/*
 * Copyright(c) RIB Software GmbH
 */

/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IEstMainConfigComplete } from '@libs/estimate/interfaces';
import { IIdentificationData } from '@libs/platform/common';
import { get } from 'lodash';

/**
 * Rounding Config ColumnId Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class RoundingConfigColumnIdLookupDataService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IEstMainConfigComplete, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'estimate/main/roundingconfigcomplete/', endPointRead: 'getroundingcolumnids', usePostForRead: false },
			},
			{
				uuid: '8782dd79e07c45739b2e2576cc66b9c9',
				valueMember: 'ColumnId',
				displayMember: 'Column',
				gridConfig: {
					columns: [
						{
							id: 'Column',
							model: 'Column',
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

	/**
	 * identify
	 * @param item
	 */
	public override identify(item: TEntity): IIdentificationData {
		const id = get(item, 'ColumnId') as number;

		return {
			id: id
		};
	}
}
