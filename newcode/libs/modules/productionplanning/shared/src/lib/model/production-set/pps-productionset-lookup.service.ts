/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IPpsProductionSetEntity } from './pps-productionset.Interface';

@Injectable({
	providedIn: 'root',
})
export class PPSProductionSetLookupService<TTEntity extends object> extends UiCommonLookupTypeDataService<IPpsProductionSetEntity, TTEntity> {
	public constructor() {
		super('productionsetlookup', {
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: 'b6f99b16e88645f3a00298dd55c50eb9',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						width: 100,
						sortable: true,
					},
					{
						id: 'Description',
						model: 'DescriptionInfo.Description',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						width: 100,
						sortable: true,
					},
				],
			},
		});
	}
}
