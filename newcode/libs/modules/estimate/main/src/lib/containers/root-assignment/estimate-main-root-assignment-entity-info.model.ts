/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IEstRootAssignmentData } from '@libs/estimate/interfaces';
import { EstimateMainRootAssignmentDataService } from './estimate-main-root-assignment-data.service';
import { EstimateMainRootAssignmentLayoutService } from './estimate-main-root-assignment-layout.service';
import { EntityDomainType } from '@libs/platform/data-access';
import { EstimateMainRootAssignmentBehavior } from './estimate-main-root-assignment-behavior.service';

/*
 * Entity information for the estimate main root assignment
 */
export const ESTIMATE_MAIN_ROOT_ASSIGNMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstRootAssignmentData>({
	grid: {
		title: { text: 'Root Assignment', key: 'estimate.main' + '.rootAssignmentTotalContainer' },
		behavior: (ctx) => ctx.injector.get(EstimateMainRootAssignmentBehavior),
	},

	// entitySchema is use because we are not taking entity dto from backend
	entitySchema: {
		schema: 'IEstRootAssignmentData',
		properties: {
			Estimate: { domain: EntityDomainType.Description, mandatory: true },
			Rule: { domain: EntityDomainType.Description, mandatory: true },
			Param: { domain: EntityDomainType.Description, mandatory: true },
		},
	},

	// Define data service token using dependency injection
	dataService: (ctx) => ctx.injector.get(EstimateMainRootAssignmentDataService),

	// Define permission UUID
	permissionUuid: '7925D8CDB20B4256A0808620C28D4666',

	// Define layout configuration using dependency injection
	layoutConfiguration: (context) => {
		return context.injector.get(EstimateMainRootAssignmentLayoutService).generateConfig();
	},
});
