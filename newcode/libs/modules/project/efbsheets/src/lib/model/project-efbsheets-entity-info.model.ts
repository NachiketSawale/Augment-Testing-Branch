/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCrewMixesLayoutService } from '@libs/basics/efbsheets';
import { ProjectEfbSheetsBehavior } from '../behavior/project-efbsheets-behavior.service';
import { ProjectEfbsheetsDataService } from '../services/project-efbsheets-data.service';

export const PROJECT_EFBSHEETS_ENTITY_INFO: EntityInfo = EntityInfo.create<IBasicsEfbsheetsEntity>({
	grid: {
		title: { key: 'project.main.crewMixes' },
		behavior: (ctx) => ctx.injector.get(ProjectEfbSheetsBehavior),
	},
	form: {
		title: { key: 'basics.clerk' + '.project.main.crewMixesDetails' },
		containerUuid: 'f31c710ae1854e30aad0812c8ba14be6'
	},
	dataService: (ctx) => ctx.injector.get(ProjectEfbsheetsDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.EfbSheets', typeName: 'EstCrewMixDto' },
	permissionUuid: '02c3e17b1fc448789beb50a22ed21143',

	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCrewMixesLayoutService).generateConfig();
	},
});
