/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { PpsMaterialSummarizedBehavior } from '../behaviors/pps-material-summarized-behavior.service';
import { IPpsSummarizedMatEntity } from './models';
import { PPS_MATERIAL_SUMMARIZED_LAYOUT } from './pps-material-summarized-layout.model';
import { PpsMaterialSummarizedDataService } from '../services/summarized/pps-material-summarized-data.service';

export const PPS_MATERIAL_SUMMARIZED_ENTITY_INFO: EntityInfo = EntityInfo.create<IPpsSummarizedMatEntity>({
	grid: {
		title: { key: 'productionplanning.ppsmaterial.summarized.listViewTitle' },
		behavior: ctx => ctx.injector.get(PpsMaterialSummarizedBehavior),
		containerUuid: '99b37b037ffd4ed98965378f2061fc61'
	},
	dataService: ctx => ctx.injector.get(PpsMaterialSummarizedDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.PpsMaterial', typeName: 'PpsSummarizedMatDto' },
	permissionUuid: '211110394b224dd392b69c5b60fe4e80',
	layoutConfiguration: PPS_MATERIAL_SUMMARIZED_LAYOUT,

});