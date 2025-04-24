/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { PpsProductionPlaceEntity } from '@libs/productionplanning/shared';

/**
 * Resource Equipment Plant Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsProductionPlaceCommonLookupService<TEntity extends object = object> extends UiCommonLookupTypeDataService<PpsProductionPlaceEntity, TEntity> {
	public constructor() {
		super('ppsproductionplace', {
			uuid: 'b0333f7a50274566abeae7226eae7e03',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'Description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
		});
	}
}
