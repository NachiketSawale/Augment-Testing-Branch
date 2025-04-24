/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { IQtoShareFormulaEntity } from '../model/entities/qto-share-formula-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class QtoShareFormulaLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IQtoShareFormulaEntity, TEntity> {
	public constructor() {
		super('QtoFormula', {
			uuid: 'db5e053d6acb435ab06c2b29c2d44ff0',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
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
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						id: 'FormulaType',
						model: 'QtoTypeDescription',
						type: FieldType.Description,
						label: { text: 'Formula Type', key: 'cloud.common.formulaType' },
						sortable: true,
						visible: true,
						readonly: true,
					},
				],
			},
		});
	}
}
