/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ICosGroupEntity } from '../../model/models';

/**
 * The construction system master group layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGroupLayoutService {
	public generateLayout(): ILayoutConfiguration<ICosGroupEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['IsChecked', 'Sorting', 'IsDefault', 'Code', 'DescriptionInfo'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					Sorting: { key: 'entitySorting', text: 'Sorting' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					IsDefault: { key: 'entityIsDefault', text: 'Is Default' },
					Code: { key: 'entityCode', text: 'Code' },
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
					IsChecked: { key: 'Filter_FilterTitle_TXT', text: 'Filter' },
				}),
			},
			overloads: {
				IsDefault: {
					type: FieldType.Boolean,
				},
			},
			transientFields: [
				{
					id: 'IsChecked',
					readonly: false,
					model: 'IsChecked',
					type: FieldType.Radio,
					pinned: true,
				},
			],
		};
	}
}
