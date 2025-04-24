/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCostCodesPriceVersionDataService } from '../services/data-service/basics-cost-codes-price-version-data.service';
import { BasicsCostCodesPriceVersionLayoutService } from '../services/layout/basics-cost-codes-price-version-layout.service';
import { ICostcodePriceVerEntity } from '@libs/basics/interfaces';
import { BasicCostCodesPriceVersionValidationService } from '../services/validation/basics-cost-codes-price-version-validation.service';

export const BASICS_COST_CODES_PRICE_VERSION_ENTITY_INFO: EntityInfo = EntityInfo.create<ICostcodePriceVerEntity>({
	grid: {
		title: { key: 'basics.costcodes' + '.priceVerion.grid.title' }
	},
	form: {
		title: { key: 'basics.costcodes' + '.priceVerion.details.title' },
		containerUuid: 'b4dce598c1d9439896381fa36c7a3b2d'
	},
	dataService: (ctx) => ctx.injector.get(BasicsCostCodesPriceVersionDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.CostCodes', typeName: 'CostcodePriceVerDto' },
	permissionUuid: 'b0f893daa2e142489a24fb0e34546897',
	validationService: (ctx) => ctx.injector.get(BasicCostCodesPriceVersionValidationService),

	layoutConfiguration: context => {
		return context.injector.get(BasicsCostCodesPriceVersionLayoutService).generateConfig();
	}
});
