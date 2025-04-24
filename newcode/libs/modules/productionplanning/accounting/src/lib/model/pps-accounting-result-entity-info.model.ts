/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { PpsAccountingResultDataService } from '../services/pps-accounting-result-data.service';
import { PpsAccountingResultBehavior } from '../behaviors/pps-accounting-result-behavior.service';
import { IResultEntity } from './entities/result-entity.interface';
import { PpsAccountingResultValidationService } from '../services/pps-accounting-result-validation.service';
import { PpsAccountingResultLayoutService } from '../services/pps-accounting-result-layout.service';


export const PPS_ACCOUNTING_RESULT_ENTITY_INFO: EntityInfo = EntityInfo.create<IResultEntity>({
	grid: {
		title: { key: 'productionplanning.accounting.result.listTitle' },
		behavior: ctx => ctx.injector.get(PpsAccountingResultBehavior),
	},
	form: {
		title: { key: 'productionplanning.accounting.result.detailTitle' },
		containerUuid: '6c2687e407024b338f354bc8b250ab98',
	},
	dataService: ctx => ctx.injector.get(PpsAccountingResultDataService),
	validationService: ctx => ctx.injector.get(PpsAccountingResultValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Accounting', typeName: 'ResultDto' },
	permissionUuid: '464c261c2b7d4111b6717aa2c13b2e82',
	layoutConfiguration: ctx => {
		return ctx.injector.get(PpsAccountingResultLayoutService).getResultLayout();
	}
});