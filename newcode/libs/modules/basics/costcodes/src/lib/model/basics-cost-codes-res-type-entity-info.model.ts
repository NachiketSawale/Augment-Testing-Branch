/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { BasicsCostCodesResTypeDataService } from '../services/data-service/basics-cost-codes-res-type-data.service';
import { ICostCode2ResTypeEntity } from './models';
import { BasicsCostCodesResourceTypeLayoutService } from '../services/layout/basics-cost-codes-resource-type-layout.service';


export const BASICS_COST_CODES_RES_TYPE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostCode2ResTypeEntity>({
	grid: {
		title: { key: 'basics.costcodes' + '.resType' },
		containerUuid: 'b2a5ef0b5b574a03935b31251ce33275',
	},
	dataService: ctx => ctx.injector.get(BasicsCostCodesResTypeDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.CostCodes', typeName: 'CostCode2ResTypeDto' },
	permissionUuid: 'ceeb3a8d7f3e41aba9aa126c7a802f87',

	layoutConfiguration: context => {
		return context.injector.get(BasicsCostCodesResourceTypeLayoutService).generateConfig();
	}

});