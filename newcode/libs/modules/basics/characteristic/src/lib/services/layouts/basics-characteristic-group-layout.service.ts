/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {ILayoutConfiguration} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';

/**
 * characteristic group layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicGroupLayoutService {
	public generateLayout(): ILayoutConfiguration<ICharacteristicGroupEntity> {
		return {
			groups: [
				{
					'gid': 'basicData',
					'title': {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					'attributes': [
						'Id',
						'DescriptionInfo'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Id': {
						'key': 'entityId',
						'text': 'Id'
					},
					'DescriptionInfo': {
						'key': 'entityDescription',
						'text': 'Description'
					}
				})
			},
			overloads: {
				Id: {
					'readonly': true
				},
				DescriptionInfo: {
					'maxLength':252
				}
			}
		};
	}
}