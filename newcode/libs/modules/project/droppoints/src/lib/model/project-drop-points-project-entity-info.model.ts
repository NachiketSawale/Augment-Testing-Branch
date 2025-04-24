/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';

import { ProjectDropPointProjectDataService } from '../services/data/project-drop-point-project-data.service';
import { ProjectDropPointProjectValidationService } from '../services/validation/project-drop-point-project-validation.service';
import { IProjectEntity, PROJECT_MAIN_LAYOUT_SERVICE_TOKEN } from '@libs/project/interfaces';

export const projectDropPointProjectEntityInfo = <IEntityInfo<IProjectEntity>>{
	grid: {
		title: {
			text: 'Project',
			key: ''
		}
	},
	form: {
		title: {
			text: 'Project',
			key: ''
		},
		containerUuid: '44050882a8e14d9386fe79f4fadd0192'
	},
	dataService: (ctx) => ctx.injector.get(ProjectDropPointProjectDataService),
	validationService: (ctx) => ctx.injector.get(ProjectDropPointProjectValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Project.Main',
		typeName: 'ProjectDto'
	},
	permissionUuid: '3a0dc5aa130e4d95af119b5c76ef47f8',
	layoutConfiguration: async (ctx) => {
		const projectMainLayoutService = await ctx.lazyInjector.inject(PROJECT_MAIN_LAYOUT_SERVICE_TOKEN);
		return projectMainLayoutService.generateLayout(ctx);
	}
};
export const PROJECT_DROP_POINT_PROJECT_ENTITY_INFO = EntityInfo.create(projectDropPointProjectEntityInfo);