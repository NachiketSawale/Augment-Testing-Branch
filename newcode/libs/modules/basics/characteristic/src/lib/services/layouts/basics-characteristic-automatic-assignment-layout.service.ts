/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IBasicsCharacteristicAutomaticAssignmentEntity } from '../../model/entities/basics-characteristic-automatic-assignment-entity.interface';

/**
 * The characteristic automatic-assignment layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicAutomaticAssignmentLayoutService {
	public generateLayout(): ILayoutConfiguration<IBasicsCharacteristicAutomaticAssignmentEntity> {
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
			}]
		};
	}
}
