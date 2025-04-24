/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCrewMixesAfsnLayoutService } from '@libs/basics/efbsheets';
import { ProjectEfbsheetsCrewMixAfsnDataService } from '../services/project-efbsheets-crew-mix-afsn-data.service';
import { IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';

export const PROJECT_EFBSHEETS_CREW_MIX_AFSN_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstCrewMixAfsnEntity>({
	grid: {
		title: { key: 'project.main.crewMixAfsn' },
	},
	form: {
		title: { key: 'project.efbsheets' + '.project.main.crewMixAfsnDetails' },
		containerUuid: 'c72b5000b2a542c18cf76abebc1bd65a'
	},
	dataService: (ctx) => ctx.injector.get(ProjectEfbsheetsCrewMixAfsnDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.EfbSheets', typeName: 'EstCrewMixAfsnDto' },
    permissionUuid: '252747cc4407415d9304a330a2340ea9',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCrewMixesAfsnLayoutService).generateConfig();
	},
});
