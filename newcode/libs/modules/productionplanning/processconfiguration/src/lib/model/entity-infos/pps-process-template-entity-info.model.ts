/*
* Copyright(c) RIB Software GmbH
*/
import { EntityInfo } from '@libs/ui/business-base';
import { ProcessTemplateEntity } from '../process-template-entity.class';
import {
	ProductionplanningProcessconfigurationProcessTemplateGridBehavior
} from '../../behaviors/process-template-grid-behavior.service';
import {
	ProductionplanningProcessconfigurationProcessTemplateDataService
} from '../../services/productionplanning-processconfiguration-process-template-data.service';

import { PpsProcessTemplateValidationService } from '../../services/process-template-validation.service';
import { PpsProcessTemplateLayoutService } from '../../services/layouts/process-template-layout.service';

export const PPS_PROCESS_TEMPLATE_ENTITY_INFO = EntityInfo.create<ProcessTemplateEntity>({
	grid: {
		title: { text: '*Process Templates', key: 'productionplanning.processconfiguration.processTemplate.listTitle' },
		behavior: ctx => ctx.injector.get(ProductionplanningProcessconfigurationProcessTemplateGridBehavior)
	},
	form: {
		title: { text: '*Process Template Details', key: 'productionplanning.processconfiguration.processTemplate.detailTitle' },
		// behavior: (ctx) => ctx.injector.get(ProductionplanningProcessconfigurationProcessTemplateFormBehavior),
		containerUuid: '080b54384d40404597ed4be6e66250e3',
	},
	dataService: (ctx) => ctx.injector.get(ProductionplanningProcessconfigurationProcessTemplateDataService),
	validationService: (ctx) => ctx.injector.get(PpsProcessTemplateValidationService),
	dtoSchemeId: { moduleSubModule: 'Productionplanning.ProcessConfiguration', typeName: 'ProcessTemplateDto' },
	permissionUuid: '3ed965bcbec84a29811bd0d8bd79598c',
	layoutConfiguration: context => {
		return context.injector.get(PpsProcessTemplateLayoutService).generateLayout();
	},
});
