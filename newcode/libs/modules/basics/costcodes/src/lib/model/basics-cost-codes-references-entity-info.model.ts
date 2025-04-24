/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCostCodesReferencesDataService } from '../services/data-service/basics-cost-codes-references-data.service';
import { BasicsCostCodesRefrenceLayoutService } from '../services/layout/basics-cost-codes-references-layout.service';
import { ICostCodesRefrenceEntity } from '@libs/basics/interfaces';

export const BASICS_COST_CODES_REFERENCES_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostCodesRefrenceEntity>({
	grid: {
		title: { key: 'Refrences' },
	},

	dataService: (ctx) => ctx.injector.get(BasicsCostCodesReferencesDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.CostCodes', typeName: 'CostCodesReferencesDto' },
	permissionUuid: '531eb2aoca9a4f62b23e009972ce42dd',

	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCostCodesRefrenceLayoutService).generateConfig();
	}
});
