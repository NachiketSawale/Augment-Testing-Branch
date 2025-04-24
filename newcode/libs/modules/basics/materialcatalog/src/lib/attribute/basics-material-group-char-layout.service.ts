/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMaterialGroupCharEntity } from '../model/entities/material-group-char-entity.interface';

/**
 * Material group layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupCharLayoutService {
	public generateLayout(): ILayoutConfiguration<IMaterialGroupCharEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['Hasfixedvalues', 'PropertyInfo'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.materialcatalog.', {
					Hasfixedvalues: {
						text: 'Fixed Values',
						key: 'hasFixedValues',
					},
					PropertyInfo: {
						text: 'Attribute',
						key: 'property',
					},
				}),
			},
			overloads: {
				Hasfixedvalues: {
					// todo - mandatory is not supported, what is the replacement of it?
					// 'mandatory': true
				},
				PropertyInfo: {
					// todo - mandatory is not supported, what is the replacement of it?
					// 'mandatory': true
				},
			},
		};
	}
}
