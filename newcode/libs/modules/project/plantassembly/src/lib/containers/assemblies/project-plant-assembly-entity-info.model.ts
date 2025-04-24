/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectPlantAssemblyBehaviorService } from './project-plant-assembly-behavior.service';
import { EstimateLineItemBaseLayoutService } from '@libs/estimate/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ProjectPlantAssemblyMainService } from './project-plant-assembly-main.service';

/**
 * Estimate Line Item Entity Info
 */
export const PROJECT_PLANT_ASSEMBLY_ENTITY_INFO = EntityInfo.create<IEstLineItemEntity>({
	grid: {
		title: { text: 'Equipment Assembly', key: 'project.main.equipassemblyTitle' },
		containerUuid: 'c163031647d6459288c5c43ed46cf6e8',
	},
	form: {
		containerUuid: 'f7b4578655914fbc85dc7f65c803cfd8',
		title: { text: 'Equipment Assembly Details', key: 'project.main.equipassemblyDetailsTitle' }
	},
	dataService: ctx => ctx.injector.get(ProjectPlantAssemblyMainService),
	//validationService: context => context.injector.get(EstimateMainLineItemValidationService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Assemblies', typeName: 'EstLineItemDto' },
	permissionUuid: 'c163031647d6459288c5c43ed46cf6e8',
	layoutConfiguration: context => {
		return context.injector.get(EstimateLineItemBaseLayoutService).generateLayout();
	},
	containerBehavior:ctx => ctx.injector.get(ProjectPlantAssemblyBehaviorService)
});