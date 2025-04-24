/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

/**
 * lookup: line type entity interface
 */
export interface IQtoShareLineTypeLookupEntity {
	Id: number;
	Code: string;
	Description: string;
}

@Injectable({
	providedIn: 'root',
})
export class QtoShareLineTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IQtoShareLineTypeLookupEntity, TEntity> {
	public constructor() {
		super('qtolinetype', {
			uuid: 'cbed25157ad14953ae173ba5dcab0001',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			searchSync: true,
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'desc',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Code', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
		});
	}
}
