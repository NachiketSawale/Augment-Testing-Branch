/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectEfbsheetsAverageWageDataService } from '../services/project-efbsheets-average-wage-data.service';
import { IBasicsEfbsheetsAverageWageEntity } from '@libs/basics/interfaces';
import { BasicsCrewMixesAverageWageLayoutService } from '@libs/basics/efbsheets';

export const PROJECT_EFBSHEETS_AVERAGE_WAGE_ENTITY_INFO: EntityInfo = EntityInfo.create<IBasicsEfbsheetsAverageWageEntity>({
	grid: {
		title: { key: 'project.main.averageWage' },
	},
	form: {
		title: { key: 'project.efbsheets' + '.project.main.averageWageDetails' },
		containerUuid: 'b9e35e5438c441c1ad3e056f7fcf29e8',
	},
	dataService: (ctx) => ctx.injector.get(ProjectEfbsheetsAverageWageDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.EfbSheets', typeName: 'EstAverageWageDto' },
	permissionUuid: 'f90a007080a5434bba20abd90a6ce823',

    layoutConfiguration: (context) => {
        return context.injector.get(BasicsCrewMixesAverageWageLayoutService).generateConfig();
    },
});
