/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { HsqeChecklistDataService } from '../../services/hsqe-checklist-data.service';
import { HsqeChecklistBehavior } from '../../behaviors/hsqe-checklist-behavior.service';
import { MODULE_INFO_CHECKLIST } from './module-info-checklist.model';
import { HsqeChecklistLayoutService } from '../../services/layouts/hsqe-checklist-layout.service';
import { HsqeChecklistValidationService } from '../../services/validations/hsqe-checklist-validation.service';
import { BasicsSharedHsqeChecklistStatusLookupService, BasicsSharedHsqeChecklistTypeLookupService, BasicsSharedNumberGenerationService } from '@libs/basics/shared';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { HSQE_CHECKLIST_STRUCTURE_BEHAVIOR_TOKEN } from '../../behaviors/hsqe-checklist-structure-behavior.service';

export const HSQE_CHECKLIST_ENTITY_INFO: EntityInfo = EntityInfo.create<IHsqCheckListEntity>({
	grid: {
		title: { key: 'hsqe.checklist.title.header' },
		behavior: (ctx) => ctx.injector.get(HsqeChecklistBehavior),
	},
	form: {
		title: { key: 'hsqe.checklist.title.headerDetail' },
		containerUuid: 'b1b8d37ab5dd407bbd1cc1668ef43376',
	},
	dataService: (ctx) => ctx.injector.get(HsqeChecklistDataService),
	validationService: (ctx) => ctx.injector.get(HsqeChecklistValidationService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_CHECKLIST.ChecklistMainModuleName, typeName: 'HsqCheckListDto' },
	permissionUuid: 'aeb09732a35a4e91a0e6d7a9d161092b',
	layoutConfiguration: (context) => {
		return context.injector.get(HsqeChecklistLayoutService).generateLayout();
	},
	prepareEntityContainer: async (ctx) => {
		const statusService = ctx.injector.get(BasicsSharedHsqeChecklistStatusLookupService);
		const typeService = ctx.injector.get(BasicsSharedHsqeChecklistTypeLookupService);
		const prcNumGenSrv = ctx.injector.get(BasicsSharedNumberGenerationService);
		await Promise.all([statusService.getList(), typeService.getList(), prcNumGenSrv.getNumberGenerateConfig('hsqe/checklist/header/numbergeneration')]);
	},
	tree: {
		containerUuid: 'ea1acc747ee94705a5c88af6fe276a31',
		title: { text: 'Check List Structure(Main/Sub)', key: 'hsqe.checklist.title.mainStructure' },
		behavior: HSQE_CHECKLIST_STRUCTURE_BEHAVIOR_TOKEN,
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IHsqCheckListEntity) {
					const service = ctx.injector.get(HsqeChecklistDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IHsqCheckListEntity) {
					const service = ctx.injector.get(HsqeChecklistDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IHsqCheckListEntity>;
		},
	},
});
