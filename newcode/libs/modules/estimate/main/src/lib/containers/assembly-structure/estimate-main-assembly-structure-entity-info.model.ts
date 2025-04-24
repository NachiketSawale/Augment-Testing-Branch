/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateMainAssemblyStructureBehavior } from './estimate-main-assembly-structure-behavior.service';
import { EstimateMainAssemblyStructureDataService } from './estimate-main-assembly-structure-data.service';
import { EstimateMainAssemblyStructureLayoutService } from './estimate-main-assembly-structure-layout.service';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';


/*
 * Entity information for the main assembly structure in estimates
 */
export const ESTIMATE_MAIN_ASSEMBLY_STRUCTURE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstAssemblyCatEntity>({
	grid: {
		title: { text: 'Assembly Structure', key: 'estimate.main' + '.assemblyCategoryContainer' },
		behavior: (ctx) => ctx.injector.get(EstimateMainAssemblyStructureBehavior)

	},

	// Define data service token using dependency injection
	dataService: (ctx) => ctx.injector.get(EstimateMainAssemblyStructureDataService),


	// Define DTO scheme ID
	dtoSchemeId: { moduleSubModule: 'Estimate.Assemblies', typeName: 'EstAssemblyCatDto' },

	// Define permission UUID
	permissionUuid: '75BBD8DF20DE4A3B8F132BDACBB203F6',

	// Define layout configuration using dependency injection
	layoutConfiguration: (context) => {
		return context.injector.get(EstimateMainAssemblyStructureLayoutService).generateConfig();
	}
});
