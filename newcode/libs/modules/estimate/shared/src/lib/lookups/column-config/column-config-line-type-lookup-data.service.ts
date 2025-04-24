/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IEstColumnConfigLineTypeEntity } from '@libs/estimate/interfaces';
import { Injectable } from '@angular/core';

/**
 * Column Config LineType Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class ColumnConfigLineTypeLookupDataService<TEntity extends object = object> extends UiCommonLookupItemsDataService<IEstColumnConfigLineTypeEntity, TEntity> {
	public constructor() {
		super(
			[
				{
					Id: 1,
					ShortKeyInfo: {
						Description: 'C',
						DescriptionTr: 0,
						DescriptionModified: false,
						Translated: 'C',
						VersionTr: 0,
						Modified: false,
						OtherLanguages: null,
					},
					DescriptionInfo: {
						Description: 'CostCodes',
						DescriptionTr: 50,
						DescriptionModified: false,
						Translated: 'CostCodes',
						VersionTr: 0,
						Modified: false,
						OtherLanguages: null,
					},
					Sorting: 1,
				},
				{
					Id: 2,
					ShortKeyInfo: {
						Description: 'M',
						DescriptionTr: 0,
						DescriptionModified: false,
						Translated: 'M',
						VersionTr: 0,
						Modified: false,
						OtherLanguages: null,
					},
					DescriptionInfo: {
						Description: 'Material',
						DescriptionTr: 0,
						DescriptionModified: false,
						Translated: 'Material',
						VersionTr: 0,
						Modified: false,
						OtherLanguages: null,
					},
					Sorting: 2,
				},
			],
			{
				uuid: '9107CA2599E7403595B2E6B3DCE8EE5D',
				valueMember: 'id',
				displayMember: 'ShortKeyInfo.Translated',
				gridConfig: {
					columns: [
						{
							id: 'Id',
							model: 'ShortKeyInfo.Translated',
							type: FieldType.Code,
							label: { text: 'code', key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true,
							readonly: true,
							tooltip: { text: 'code', key: 'cloud.common.entityCode' },
						},
						{
							id: 'Description',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { text: 'description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
							tooltip: { text: 'description', key: 'cloud.common.entityDescription' },
						},
					],
				},
			},
		);
	}
}
