/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IControllingUnitEntity } from '@libs/basics/shared';



import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';


/*
 * Service to generate layout configuration for the controlling unit structure in estimates
 */
@Injectable({
	providedIn: 'root',                        
})
export class EstimateMainControllingUnitLayoutService {
	/*
	 * Generate layout configuration
	 */
	public async generateConfig(): Promise<ILayoutConfiguration<IControllingUnitEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'estimate.main.controllingContainer',
					},
					attributes: ['Code', 'DescriptionInfo', 'Quantity', 'UomFk', 'Rule', 'Parameter']  // TODO: rule , prameter lookup not ready
				}
			],
			labels: {
				// Prefix all translation keys for the estimate main module and cloud common module
				...prefixAllTranslationKeys('estimate.main.', {
					Quantity: { key: 'Quantity' },
					Code: { key: 'Code' },
					Rule: { key: 'Rule' },
					Parameter: { key: 'Parameter' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Description: { key: 'DescriptionInfo' },

					UomFk: { key: 'entityUoM' }
				})
			}
		};
	}
}
