/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedHistoricalPriceForItemEntityInfo } from '@libs/basics/shared';
import { ProcurementQuoteHistoricalPriceForItemDataService } from '../../services/quote-historical-price-for-item-data.service';

export const QUOTE_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO = BasicsSharedHistoricalPriceForItemEntityInfo.create({
	permissionUuid: '20c4ae4c217445e69c7d1b491c07ac52',
	dataServiceToken: ProcurementQuoteHistoricalPriceForItemDataService
});