/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IEstRootAssignmentData } from '@libs/estimate/interfaces';

/*
 * Service to generate layout configuration for the root assignment in estimates main
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainRootAssignmentLayoutService {
	/*
	 * Generate layout configuration
	 */
	public async generateConfig(): Promise<ILayoutConfiguration<IEstRootAssignmentData>> {
		return {
			groups: [
				{
					gid: 'rootAssignment',
					title: {
						text: 'Root Assignment',
						key: 'estimate.main.rootAssignmentTotalContainer',
					},
					attributes: ['Estimate', 'Rule', 'Param']
				}
			],
			labels: {
				// Prefix all translation keys for the estimate main module and cloud common module
				...prefixAllTranslationKeys('estimate.main.', {
					Estimate: { key: 'estimate' },
					Rule: { key: 'estRuleAssignmentConfigDetails.rules' },
					Param: { key: 'estRuleAssignmentConfigDetails.parameters' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {})
			}
		};
	}
}
