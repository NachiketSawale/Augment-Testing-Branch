/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';

/*
 * Service to generate layout configuration for the main assembly structure in estimates
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateMainAssemblyStructureLayoutService {
	/*
	 * Generate layout configuration
	 */
	public async generateConfig(): Promise<ILayoutConfiguration<IEstAssemblyCatEntity>> {
		return {
			groups: [
				{
					gid: 'assemblyStructure',
					title: {
						text: 'Assembly Structure',
						key: 'estimate.main.assemblyCategoryContainer',
					},
					attributes: ['Filter', 'Structure', 'Code', 'DescriptionInfo', 'Rule', 'Parameter']
				}
			],
			labels: {
				// Prefix all translation keys for the estimate main module and cloud common module
				...prefixAllTranslationKeys('estimate.main.', {
					Filter: { key: 'Filter' },
					Structure: { key: 'Structure' },
					Code: { key: 'Code' },
					Description: { key: 'DescriptionInfo' },
					Rule: { key: 'Rule' },
					Parameter: { key: 'Parameter' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {})
			}
		
	



			// todo Description column not showing data (platform issue)
			// Lookup are not implemented

			/* overloads: {
                Filter :{
    
                    type: FieldType.select,
                    
                    }),
                    width: 145
                }
            },

			overloads: {
                Rule :{
    
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: ,
                        showClearButton: true,
                        showDescription: true,
                        descriptionMember: '',
                        readonly:false
                    }),
                    width: 145
                }
            },
			overloads: {
                Parameter :{
    
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: ,
                        showClearButton: true,
                        showDescription: true,
                        descriptionMember: '',
                        readonly:false
                    }),
                    width: 145
                }
            },
			*/
		};
	}
}
