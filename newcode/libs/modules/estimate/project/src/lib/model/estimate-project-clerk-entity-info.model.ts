/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateProjectClerkBehavior } from '../behaviors/estimate-project-clerk-behavior.service';
import { EstimateProjectClerkDataService } from '../services/estimate-project-clerk-data.service';
import { IEstimateProjectHeader2ClerkEntity } from './entities/estimate-project-header-2clerk-entity.interface';
import { EstimateProjectClerkLayoutService } from '../services/estimate-project-clerk-layout.service';


/**
 * @brief Entity information for the estimate project clerk.
 *
 * This constant defines the entity information for the estimate project clerk, including the
 * grid and form configurations, data service, DTO scheme ID, permission UUID, and layout configuration.
 */
export const ESTIMATE_PROJECT_CLERK_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstimateProjectHeader2ClerkEntity>({
	grid: {
		title: { key: 'estimate.project.estimateProjectClerkListTitle' },
	},
	form: {
		title: { key: 'estimate.project.estimateProjectClerkDetailTitle' },
		containerUuid: 'a8eceb9f41f8475fa35b876a642c22d5',
		behavior: (ctx) => ctx.injector.get(EstimateProjectClerkBehavior)
	},

	dataService: (ctx) => ctx.injector.get(EstimateProjectClerkDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Project', typeName: 'EstimateProjectHeader2ClerkDto' },
	permissionUuid: 'bceaa9e8a4f04e5797e87871078e6edc',

	layoutConfiguration: (context) => {
		return context.injector.get(EstimateProjectClerkLayoutService).generateLayout();
	},
});
