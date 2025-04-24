/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectEfbsheetsCrewMixAfDataService } from '../services/project-efbsheets-crew-mix-af-data.service';
import { IEstCrewMixAfEntity } from '@libs/basics/interfaces';
import { BasicsCrewMixesAfLayoutService } from '@libs/basics/efbsheets';

export const PROJECT_EFBSHEETS_CREW_MIX_AF_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstCrewMixAfEntity>({
	grid: {
		title: { key: 'project.main.crewMixAf' }
	},
	form: {
		title: { key: 'project.efbsheets' + '.project.main.crewMixAfDetails' },
		containerUuid: 'c61d6e182951469dbf47cbd719345e76',
	},
	dataService: (ctx) => ctx.injector.get(ProjectEfbsheetsCrewMixAfDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.EfbSheets', typeName: 'EstCrewMixAfDto' },
	permissionUuid: 'e05fa5f85cc14e419fd7ca3adc492a88',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCrewMixesAfLayoutService).generateConfig();
	}
});
