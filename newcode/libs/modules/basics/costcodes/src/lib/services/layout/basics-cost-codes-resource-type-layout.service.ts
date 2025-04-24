/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, createLookup } from '@libs/ui/common';
import { ICostCode2ResTypeEntity } from '../../model/models';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceTypeLookupService } from '@libs/resource/shared';
import { BasicsSharedResourceContextLookupService } from '@libs/basics/shared';
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesResourceTypeLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<ICostCode2ResTypeEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['ResourceContextFk', 'ResTypeFk']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: { key: 'entityDescription' },
				}),
				...prefixAllTranslationKeys('basics.costcodes.', {
					ResourceContextFk: { key: 'resourceContext' },
					ResTypeFk: { key: 'resType' }
				}),
			},
			overloads: {
				ResTypeFk: {
					readonly: false,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ResourceTypeLookupService,
					}),
				},
				ResourceContextFk: {
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedResourceContextLookupService,
					}),
					type: FieldType.Lookup,
					visible: true
				}
			}
		};
	}
}
