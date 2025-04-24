/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateAssembliesAssemblyCategoriesDataService } from './estimate-assemblies-assembly-categories-data.service';
import { EstimateAssemblyAssemblyCategoriesLayoutService } from './estimate-assemblies-assembly-categories-layout.service';
import { EstimateAssemblyAssembliesCategoryBehavior } from './estimate-assembliess-assembly-categories-behavior.service';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';

/*
 * Entity information for the main assembly category in estimates
 */
export const ESTIMATE_ASSEMBLIES_ASSEMBLY_CATEGORY_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstAssemblyCatEntity>({
	grid: {
		title: { key: 'estimate.assemblies.containers' + '.assemblyStructure' },
		containerUuid: '75BBD8DF20DE4A3B8F132BDACBB203F6',

		// Define behavior using dependency injection
		behavior: (ctx) => ctx.injector.get(EstimateAssemblyAssembliesCategoryBehavior),
	},

	// Define data service token using dependency injection
	dataService: (ctx) => ctx.injector.get(EstimateAssembliesAssemblyCategoriesDataService),

	// Define DTO scheme ID
	dtoSchemeId: { moduleSubModule: 'Estimate.Assemblies', typeName: 'EstAssemblyCatDto' },

	// Define permission UUID
	permissionUuid: '75BBD8DF20DE4A3B8F132BDACBB203F6',

	// Define layout configuration using dependency injection
	layoutConfiguration: (context) => {
		return context.injector.get(EstimateAssemblyAssemblyCategoriesLayoutService).generateConfig();
	},
});
