/*
 * Copyright(c) RIB Software GmbH
 */

import { IQuote2RfqVEntity } from '@libs/procurement/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementPriceComparisonQuoteByRequestDataService } from '../../services/quote-by-request-data.service';
import { ProcurementPriceComparisonQuoteByRequestBehavior } from '../../behaviors/quote-by-request-list-behavior.service';
import { QuoteByRequestLayoutService } from '../../services/layouts/quote-by-request-layout.service';

export const PRICE_COMPARISON_QUOTE_BY_REQUEST_ENTITY_INFO: EntityInfo = EntityInfo.create<IQuote2RfqVEntity>({
	grid: {
		containerUuid: 'deb620733c7e494b8f4d261c4aa01c6b',
		title: {
			text: 'Simple Comparison',
			key: 'procurement.pricecomparison' + '.simpleComparison'
		},
		behavior: (ctx) => ctx.injector.get(ProcurementPriceComparisonQuoteByRequestBehavior),
	},
	dataService: (ctx) => ctx.injector.get(ProcurementPriceComparisonQuoteByRequestDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.PriceComparison', typeName: 'Quote2RfqVDto' },
	permissionUuid: '1ec440875e364e8684f0ad25f0d94510',
	layoutConfiguration: async (ctx) => {
		return ctx.injector.get(QuoteByRequestLayoutService).generateLayout();
	}
});