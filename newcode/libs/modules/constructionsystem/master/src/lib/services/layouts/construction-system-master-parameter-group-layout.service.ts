/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICosParameterGroupEntity } from '@libs/constructionsystem/shared';

/**
 * Parameter Group layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterGroupLayoutService {
	public generateLayout(): ILayoutConfiguration<ICosParameterGroupEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['DescriptionInfo', 'Sorting', 'IsDefault'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
					Sorting: {
						key: 'entitySorting',
						text: 'Sorting',
					},
					IsDefault: {
						key: 'entityIsDefault',
						text: 'Is Default',
					},
				}),
			},
			overloads: {},
		};
	}
}
