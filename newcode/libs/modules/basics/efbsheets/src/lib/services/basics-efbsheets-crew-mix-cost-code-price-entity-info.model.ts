/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsEfbsheetsCrewMixCostCodePriceDataService } from './basics-efbsheets-crew-mix-cost-code-price-data.service';
import { ICostCodeEntity } from '@libs/basics/costcodes';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsEfbsheetsCrewMixCostCodePriceBehavior } from './basics-efbsheets-crew-mix-cost-code-price-behavior.service';

export const BascisEfbsheetsCrewMixesCostCodePriceEntityInfo: EntityInfo = EntityInfo.create<ICostCodeEntity>({
	grid: {
		title: { key: 'basics.efbsheets.costCodePriceList' },
		behavior: (ctx) => ctx.injector.get(BasicsEfbsheetsCrewMixCostCodePriceBehavior)
	},
	form: {
		title: { key: 'basics.costcodes' + '.estimate.main.lineItemsDetails' },
		containerUuid: 'e1956964883749dfa7cf4207d1eb3b50',
	},
	dataService: (ctx) => ctx.injector.get(BasicsEfbsheetsCrewMixCostCodePriceDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.CostCodes', typeName: 'CostcodePriceListDto' },
	permissionUuid: 'd256a1e7881142dea135dde54081ff5a',

	layoutConfiguration: {
		groups: [
			{
				gid: 'efbsheets',
				attributes: ['CurrencyFk', 'Rate']
			}
		],
		labels: {
			...prefixAllTranslationKeys('basics.costcodes.', {
				CurrencyFk: { key: 'currency' },
				PercentHour: { key: 'percentHour' },
				Rate: { key: 'rate' }
			})
		}
	}
});
