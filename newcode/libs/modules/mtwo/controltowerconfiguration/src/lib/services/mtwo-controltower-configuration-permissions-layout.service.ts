/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMtwoPowerbiItemEntity } from '@libs/mtwo/interfaces';

/**
 * Mtwo Control tower Configuration Permissions layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class MtwoControlTowerConfigurationPermissionsLayoutService {
	public generateLayout(): ILayoutConfiguration<IMtwoPowerbiItemEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['Name'],
					additionalAttributes:['Description']
				},
			],
			overloads: {
				Name: {
					readonly: false,
				},
			},
			additionalOverloads: {
			    'Description':{
			        readonly: false,
			    }
			},
			labels: {
				...prefixAllTranslationKeys('usermanagement.right.', {
					Name: { key: 'structureName', text: 'Name' },
					Description: { key: 'descriptorDescription', text: 'Description' },
				}),
			},
		};
	}
}
