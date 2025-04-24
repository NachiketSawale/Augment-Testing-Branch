/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICharacteristicSectionEntity } from '../../model/entities/characteristic-section-entity.interface';

/**
 * The characteristic section layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicSectionLayoutService {
	public generateLayout(): ILayoutConfiguration<ICharacteristicSectionEntity> {
		return {
			suppressHistoryGroup: true,
			groups: [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'Checked',
						'DescriptionInfo'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.characteristic.', {
					'SectionName': {
						'key': 'entitySection',
						'text': 'Section'
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					'Checked': {
						'key': 'entityChecked',
						'text': 'Checked'
					},
					'DescriptionInfo': {
						'key': 'entityDescription',
						'text': 'Description'
					}
				})
			},
			overloads: {
				DescriptionInfo: {
					'readonly': true
				}
			},
			transientFields: [{
				id: 'Checked',
				model: 'Checked',
				type: FieldType.Boolean,
				readonly: false,
				pinned: true
			}],
		};
	}
}
