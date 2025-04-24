/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICharacteristicValueEntity } from '@libs/basics/interfaces';

/**
 * The characteristic discrete value layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicDiscreteValueLayoutService {
	public generateLayout(): ILayoutConfiguration<ICharacteristicValueEntity> {
		return {
			groups: [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'Sorting',
						'DescriptionInfo',
						'IsDefault'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Sorting': {
						'key': 'entitySorting',
						'text': 'Sorting'
					},
					'DescriptionInfo': {
						'key': 'entityDescription',
						'text': 'Description'
					},
					'IsDefault': {
						'key': 'entityIsDefault',
						'text': 'Is Default'
					}
				})
			},
			overloads: {}

		};
	}
}