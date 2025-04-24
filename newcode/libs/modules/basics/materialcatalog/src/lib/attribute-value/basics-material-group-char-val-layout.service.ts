/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMaterialGroupCharvalEntity } from '../model/entities/material-group-charval-entity.interface';

/**
 * The material group attribute value layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupCharValLayoutService {
	public generateLayout(): ILayoutConfiguration<IMaterialGroupCharvalEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['CharacteristicInfo'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.materialcatalog.', {
					CharacteristicInfo: {
						key: 'characteristic',
						text: 'Value',
					},
				}),
			},
			overloads: {
				CharacteristicInfo: {
					// todo - mandatory is not supported, what is the replacement of it?
					// 'mandatory': true
				},
			},
		};
	}
}
