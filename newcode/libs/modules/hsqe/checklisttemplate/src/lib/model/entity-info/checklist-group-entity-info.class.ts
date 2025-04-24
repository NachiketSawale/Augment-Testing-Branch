/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IHsqCheckListGroupEntity } from '@libs/hsqe/interfaces';
import { CheckListGroupDataService } from '../../services/checklist-group-data.service';
import { ChecklistGroupLayoutService } from '../../services/layouts/checklist-group-layout.service';
import { CheckListGroupValidationService } from '../../services/validations/checklist-group-validation.service';
import { CheckListGroupBehavior } from '../../services/behaviors/checklist-group-behavior.service';

export const CHECKLIST_GROUP_INFO: EntityInfo = EntityInfo.create<IHsqCheckListGroupEntity>({
	grid: {
		title: { text: 'Group', key: 'hsqe.checklisttemplate.groupGridContainerTitle' },
		behavior: (ctx) => ctx.injector.get(CheckListGroupBehavior),
		treeConfiguration: true,
	},
	form: {
		containerUuid: '80b2138b1b6444cd94940936388934bd',
		title: { text: 'Group Detail', key: 'hsqe.checklisttemplate.groupFormContainerTitle' },
	},
	dataService: (ctx) => ctx.injector.get(CheckListGroupDataService),
	validationService: (ctx) => ctx.injector.get(CheckListGroupValidationService),
	dtoSchemeId: { moduleSubModule: 'Hsqe.CheckListTemplate', typeName: 'HsqCheckListGroupDto' },
	permissionUuid: '2553abee981141278e32bd1f1f601478',
	layoutConfiguration: (context) => {
		return context.injector.get(ChecklistGroupLayoutService).generateLayout();
	},
});
