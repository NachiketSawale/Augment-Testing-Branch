/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectMainPrj2BusinessPartnerEntity, PROJECT_MAIN_PRJ2BP_LAYOUT_SERVICE_TOKEN } from '@libs/project/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainPrj2BusinessPartnerValidationService } from '../services/project-main-prj-2-business-parnter-validation.service';
import { ProjectMainPrj2BusinessPartnerDataService } from '../services/project-main-prj-2-business-partner-data.service';

export const projectMainPrj2BusinessPartnerEntityInfo: EntityInfo = EntityInfo.create ({
	grid: {
		title: {key: 'project.main' + '.listPrj2BpTitle'},
	},
	form: {
		title: {key: 'project.main' + '.detailPrj2BpTitle'},
		containerUuid: 'A47736265C1242348D032A55DE80AA99',
	},
	entityFacadeId: 'a029462b8e9342dfb1030f8884ed080b',
	dataService: ctx => ctx.injector.get(ProjectMainPrj2BusinessPartnerDataService),
	validationService: ctx => ctx.injector.get(ProjectMainPrj2BusinessPartnerValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'Project2BusinessPartnerDto'},
	permissionUuid: 'B15A05E067094D3988F4626281C88E24',
	layoutConfiguration: async (ctx) => {
		const prj2bpLayoutService = await ctx.lazyInjector.inject(PROJECT_MAIN_PRJ2BP_LAYOUT_SERVICE_TOKEN);
		return prj2bpLayoutService.generateLayout();
	}

} as IEntityInfo<IProjectMainPrj2BusinessPartnerEntity>);