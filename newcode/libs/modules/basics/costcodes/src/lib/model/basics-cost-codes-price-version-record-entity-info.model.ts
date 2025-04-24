/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCostCodesPriceVersionListRecordDataService } from '../services/data-service/basics-cost-codes-price-version-list-record-data.service';
import { BasicsCostCodesPriceListLayoutService } from '../services/layout/basics-cost-codes-price-list-layout.service';
import { ICostcodePriceListEntity } from '@libs/basics/interfaces';
import { BasicsCostCodesPriceListDetailsBehavior } from '../services/behaviors/basics-cost-codes-price-list-detail-behavior.service';
import {BasicsCostcodesPriceVersionListRecordValidationService} from '../services/validation/basics-cost-codes-price-version-list-record-validation.service';

export const BASICS_COST_CODES_PRICE_VERSION_RECORD_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostcodePriceListEntity>({
	grid: {
		title: { key: 'basics.costcodes' + '.priceList.grid.title' }
	},
	form: {
		title: { key: 'basics.costcodes' + '.priceList.details.title' },
		containerUuid: '415a3fb901b2437a8634e5d2e44a3df6',
		behavior: (ctx) => ctx.injector.get(BasicsCostCodesPriceListDetailsBehavior)
	},
	dataService: (ctx) => ctx.injector.get(BasicsCostCodesPriceVersionListRecordDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.CostCodes', typeName: 'CostcodePriceListDto' },
	permissionUuid: 'bbc1b97341f84baf931f3d2bda0e7111',
	validationService: (ctx) => ctx.injector.get(BasicsCostcodesPriceVersionListRecordValidationService),
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsCostCodesPriceListLayoutService).generateConfig();
	}
});
