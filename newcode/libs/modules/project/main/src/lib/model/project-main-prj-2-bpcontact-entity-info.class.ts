/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectMainPrj2BPContactEntity, PROJECT_MAIN_PRJ2BPCONTACT_LAYOUT_SERVICE_TOKEN } from '@libs/project/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ProjectMainPrj2BpContactDataService } from '../services/project-main-prj-2-bpcontact-data.service';
import { ProjectMainPrj2BpContactValidationService } from '../services/project-main-prj-2-bpcontact-validation.service';

export const projectMainPrjBpContactEntityInfo: EntityInfo = EntityInfo.create({
	grid: {
		title: { key: 'project.main' + '.listPrj2BpContactTitle' },
	},
	form: {
		title: { key: 'project.main' + '.detailPrj2BpContactTitle' },
		containerUuid: 'B2CDEC2972234462804B1ACA15E00330',
	},
	dataService: ctx => ctx.injector.get(ProjectMainPrj2BpContactDataService),
	validationService: ctx => ctx.injector.get(ProjectMainPrj2BpContactValidationService),
	dtoSchemeId: { moduleSubModule: 'Project.Main', typeName: 'Project2BusinessPartnerContactDto' },
	permissionUuid: '09B099CDD4BF4AAFB4BC7D28DD8BF1C9',
	layoutConfiguration: async (ctx) => {
		const prj2bpcontactLayoutService = await ctx.lazyInjector.inject(PROJECT_MAIN_PRJ2BPCONTACT_LAYOUT_SERVICE_TOKEN);
		return prj2bpcontactLayoutService.generateLayout();
	}
} as IEntityInfo<IProjectMainPrj2BPContactEntity>);