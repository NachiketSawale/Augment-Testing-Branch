/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateAssembliesResourceBaseLayoutService } from '@libs/estimate/shared';
import { ProjectPlantAssemblyResourceDataService } from './project-plant-assembly-resource-data.service';
import { IEstResourceEntity } from '@libs/estimate/interfaces';

/**
 * Project Plant Assembly Resource Entity Info
 */
export const PROJECT_PLANT_ASSEMBLY_RESOURCE_ENTITY_INFO = EntityInfo.create<IEstResourceEntity>({
	grid: {
		title: { text: 'Equipment Assembly Resources', key: 'project.main.equipassemblyResourceTitle' },
		containerUuid: 'BEDC9497CA84537AE6C8CABBB0B8FAEB'
	},
	dataService: ctx => ctx.injector.get(ProjectPlantAssemblyResourceDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstResourceDto' },
	permissionUuid: 'c163031647d6459288c5c43ed46cf6e8',
	layoutConfiguration: context => {
		return context.injector.get(EstimateAssembliesResourceBaseLayoutService).generateLayout();
	}
});