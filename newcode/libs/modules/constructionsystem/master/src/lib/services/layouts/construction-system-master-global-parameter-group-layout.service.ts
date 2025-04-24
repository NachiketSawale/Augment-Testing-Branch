/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICosGlobalParamGroupEntity } from '@libs/constructionsystem/shared';

/**
 * Global Parameter Group layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterGroupLayoutService {
	public generateLayout(): ILayoutConfiguration<ICosGlobalParamGroupEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Code', 'DescriptionInfo', 'Sorting', 'IsDefault', 'IsLive'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
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
					IsLive: {
						key: 'entityIsLive',
						text: 'Active',
					},
				}),
			},
			overloads: {},
		};
	}
}
