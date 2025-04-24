/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';

/*
 * Service to generate layout configuration for the main assembly structure in estimates
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainLocationLayoutService {
	/*
	 * Generate layout configuration
	 */
	public async generateConfig(): Promise<ILayoutConfiguration<IProjectLocationEntity>> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						text: 'Locations',
						key: 'estimate.main.locationContainer',
					},
					attributes: ['Code', 'DescriptionInfo', 'Quantity'],    // TODO : Rule, Parameter 
				},
			],
			labels: {
				...prefixAllTranslationKeys('estimate.main.', {
					Quantity: { key: 'Quantity' },
					Structure: { key: 'Structure' },

					Description: { key: 'DescriptionInfo' },
					Rule: { key: 'Rule' },
					Parameter: { key: 'Parameter' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' },
				}),
			},
		};
	}
}
