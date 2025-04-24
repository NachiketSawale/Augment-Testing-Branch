/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainForCOStructureDataService } from '../services/project-main-for-costructure-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectMainForCOStructureBehavior } from '../behaviors/project-main-for-costructure-behavior.service';
import { IControllingCommonProjectEntity } from '@libs/controlling/common';

export const PROJECT_MAIN_FOR_COSTRUCTURE_ENTITY_INFO: EntityInfo = EntityInfo.create<IControllingCommonProjectEntity>({
	grid: {
		title: {key: 'controlling.structure' + '.containerTitleProjects'},
		behavior: ctx => ctx.injector.get(ProjectMainForCOStructureBehavior),
	},
	dataService: ctx => ctx.injector.get(ProjectMainForCOStructureDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ProjectDto'},
	permissionUuid: '021C5211C099469BB35DCF68E6AEBEC7',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Basic Data',
				attributes: ['StatusFk', 'TypeFk', 'ProjectNo', 'ProjectName', 'ProjectName2', 'StartDate', 'CalendarFk'
				]
			}
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				ProjectName: {key: 'entityName'},
				StatusFk: {key: 'entityStatus'},
				TypeFk: {key: 'entityType'},
				StartDate: {key: 'entityStartDate'},
				ProjectNo: {key: 'entityProjectNo'},
				CalendarFk: {key: 'entityCalCalendarFk'},
				ProjectName2: {key: 'entityProjectName2'},
			}),
		}
	}

});