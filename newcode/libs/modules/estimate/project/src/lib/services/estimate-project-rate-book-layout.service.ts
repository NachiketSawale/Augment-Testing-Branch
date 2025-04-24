/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IRateBookEntity } from '@libs/project/interfaces';

@Injectable({ providedIn: 'root' })
export class EstimateProjectRateBookLayoutService {
	/**
	 * get Layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IRateBookEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					attributes: ['IsChecked', 'Code', 'DescriptionInfo']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: 'Code' },
					DescriptionInfo: { key: 'entityDescription', text: 'Description' }
				}),
				...prefixAllTranslationKeys('basics.material.', {
					IsChecked: { key: 'record.filter', text: 'Filter' }
				}),
				...prefixAllTranslationKeys('project.main.', {
					IsActive: { key: 'entityIsActive', text: 'IsActive' }
				})
			},
			overloads: {
				// TODO: basics-material-checkbox directive
				IsChecked: {
					type: FieldType.Boolean
				},
			},
		};
	}
}
