/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';

/*
 * Service to generate layout configuration for the assembly category
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateAssemblyAssemblyCategoriesLayoutService {
	/*
	 * Generate layout configuration
	 */

	public async generateConfig(): Promise<ILayoutConfiguration<IEstAssemblyCatEntity>> {
		return {
			groups: [
				{
					gid: 'assemblyStructure',
					title: {
						text: 'Assembly Categories',
						key: 'estimate.assemblies.containers.assemblyStructure',
					},
					attributes: ['Filter', 'Structure', 'Code', 'DescriptionInfo', 'From Item Code', 'To Item Code'],
				},
			],
			labels: {
				// Prefix all translation keys for the estimate assemblies module and cloud common module
				...prefixAllTranslationKeys('estimate.assemblies.', {
					Filter: { key: 'Filter' },
					Structure: { key: 'Structure' },
					Code: { key: 'entityCode' },
					Description: { key: 'DescriptionInfo' },
					entityMinValue: { key: 'From Item Code' },
					entityMaxValue: { key: 'To Item Code' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {}),
			},

			// todo Description column not showing data (platform issue)
			// todo Filter and Structure logic is not implemented yet
		};
	}
}
