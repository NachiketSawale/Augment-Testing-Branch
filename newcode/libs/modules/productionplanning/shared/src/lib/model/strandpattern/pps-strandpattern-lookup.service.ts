/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IPpsStrandPatternEntity } from './productionplanning-strandpattern-entity.class';

@Injectable({
	providedIn: 'root',
})
export class PPSStrandPatternLookupService<TTEntity extends object> extends UiCommonLookupTypeDataService<IPpsStrandPatternEntity, TTEntity> {
	public constructor() {
		super('PpsStrandPattern', {
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '97145b37867a4298abf9cfa843c31ccc',
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
						id: 'CadCode',
						model: 'CadCode',
						type: FieldType.Code,
						label: { text: 'CadCode', key: 'productionplanning.strandpattern.CadCode' },
						width: 100,
						sortable: true,
					},
				],
			},
		});
	}
}
