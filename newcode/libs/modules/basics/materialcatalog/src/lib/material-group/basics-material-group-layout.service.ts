/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider, IMaterialGroupEntity } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Material group layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialGroupLayoutService {
	public async generateLayout(): Promise<ILayoutConfiguration<IMaterialGroupEntity>> {
		const basicFields: (keyof IMaterialGroupEntity)[] = ['Code', 'PrcStructureFk', 'DescriptionInfo'];

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: basicFields,
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						text: 'Code',
						key: 'entityCode',
					},
					PrcStructureFk: {
						text: 'Structure Code',
						key: 'entityStructureCode',
					},
					DescriptionInfo: {
						text: 'Description',
						key: 'entityDescription',
					},
				}),
				...prefixAllTranslationKeys('basics.material.', {
					IsChecked: {
						key: 'record.filter',
						text: 'filter',
					},
				}),
			},
			overloads: {
				Code: {
					//mandatory: true
					// todo - mandatory is not supported yet
				},
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
			},
		};
	}
}
